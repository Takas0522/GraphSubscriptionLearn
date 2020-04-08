using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SubscriptionBackEnd.Repositories;

[assembly: FunctionsStartup(typeof(SubscriptionBackEnd.Startup))]
namespace SubscriptionBackEnd
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IGraphRepository, GraphRepository>();
        }
    }
}
