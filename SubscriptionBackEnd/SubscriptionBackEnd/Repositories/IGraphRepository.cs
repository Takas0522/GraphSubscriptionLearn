using System.Threading.Tasks;

namespace SubscriptionBackEnd.Repositories
{
    public interface IGraphRepository
    {
        public Task<object> GetEventData(string eventId, string userId);
    }
}