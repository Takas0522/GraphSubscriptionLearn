using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Graph.Auth;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SubscriptionBackEnd.Repositories
{
    public class GraphRepository : IGraphRepository
    {
        private readonly GraphServiceClient _grphClient;
        public GraphRepository(IConfiguration config)
        {
            string applicationId = config.GetSection("GraphSettings:ApplicationId").Get<string>();
            string applicationSecret = config.GetSection("GraphSettings:ApplicationSecret").Get<string>();
            string tenant = config.GetSection("GraphSettings:TenantId").Get<string>();

            IPublicClientApplication publicClientApplication = PublicClientApplicationBuilder
                        .Create(applicationId)
                        .Build();

            IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                .Create(applicationId)
                .WithTenantId(tenant)
                .WithClientSecret(applicationSecret)
                .Build();

            ClientCredentialProvider authProvider = new ClientCredentialProvider(confidentialClientApplication);

            _grphClient = new GraphServiceClient(authProvider);
        }

        public async Task<object> GetEventData(string eventId, string userId)
        {
            try
            {
                return await _grphClient.Users[userId].Events[eventId].Request().Select(s => new { s.Subject }).GetAsync();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
