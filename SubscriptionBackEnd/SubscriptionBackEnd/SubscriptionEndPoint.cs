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
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace SubscriptionBackEnd
{
    public class SubscriptionEndPoint
    {
        private readonly IGraphRepository _rep;
        public SubscriptionEndPoint(
            IGraphRepository rep
        )
        {
            _rep = rep;
        }

        [FunctionName("Function1")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log,
            [SignalR(HubName = "broadcast")]IAsyncCollector<SignalRMessage> signalRMessages
        )
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string token = req.Query["validationToken"];
            if (token != null)
            {
                log.LogInformation("token Validation");
                return new ContentResult { Content = token, ContentType = "text/plain", StatusCode = 200 };
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            var data = JsonSerializer.Deserialize<SubscriptionData>(requestBody);
            var value = data.Values.First();

            string[] parseData = value.ResourceData.FullId.Split("/");
            string userId = parseData[1];
            string eventId = parseData[3];

            // 365Ç≈ó\íËä«óùÇµÇƒÇÈÇ»ÇÁÇ±Ç±Ç≈éÊÇËÇΩÇ¢ÇÀÅI
            //var subject = await _rep.GetEventData(eventId, userId);

            log.LogInformation(requestBody);

            await signalRMessages.AddAsync(new SignalRMessage()
            {
                Target = "notify",
                Arguments = new object[] { new { userId, eventId, changeType = value.ChangeType } }
            });

            return new OkObjectResult("run");
        }
    }
}
