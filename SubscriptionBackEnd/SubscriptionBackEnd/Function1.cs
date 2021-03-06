using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using SubscriptionBackEnd.Models;
using System.Linq;
using Utf8Json;

namespace SubscriptionBackEnd
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log,
            [SignalR(HubName = "broadcast")]IAsyncCollector<SignalRMessage> signalRMessages
        )
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string token = req.Query["validationToken"];
            if (token != null)
            {
                return new ContentResult { Content = token, ContentType = "text/plain", StatusCode = 200 };
            }

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            log.LogInformation(requestBody);

            var data = JsonSerializer.Deserialize<SubscriptionData>(requestBody);
            var value = data.Values.First();

            string[] parseData = value.ResourceData.FullId.Split("/");
            string userId = parseData[1];
            string eventId = parseData[3];

            await signalRMessages.AddAsync(new SignalRMessage()
            {
                Target = "notify",
                Arguments = new object[] { new { userId, eventId, changeType = value.ChangeType } }
            });

            return new OkObjectResult("run");
        }
    }
}
