using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Utf8Json;
using SubscriptionBackEnd.Models;
using SubscriptionBackEnd.Repositories;
using System.Linq;

namespace SubscriptionBackEnd
{
    public class Function1
    {
        private readonly IGraphRepository _rep;
        public Function1(
            IGraphRepository rep
        )
        {
            _rep = rep;
        }

        [FunctionName("Function1")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log
        )
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string token = req.Query["validationToken"];
            if (token != null)
            {
                return new ContentResult { Content = token, ContentType = "text/plain", StatusCode = 200 };
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            var data = JsonSerializer.Deserialize<SubscriptionData>(requestBody);
            var value = data.Values.First();

            string[] parseData = value.ResourceData.FullId.Split("/");
            string userId = parseData[1];
            string eventId = parseData[3];

            var subject = await _rep.GetEventData(eventId, userId);

            log.LogInformation(requestBody);

            return new OkObjectResult("run");
        }
    }
}
