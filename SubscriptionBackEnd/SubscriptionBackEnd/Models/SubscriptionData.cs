using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace SubscriptionBackEnd.Models
{
    public class SubscriptionData
    {
        [DataMember(Name ="value")]
        public IEnumerable<ValueObject> Values { get; set; }
    }

    public class ValueObject
    {
        [DataMember(Name = "subscriptionId")]
        public string SubscriptionId { get; set; }
        [DataMember(Name = "subscriptionExpirationDateTime")]
        public DateTime SubscriptionExpirationDateTime { get; set; }
        [DataMember(Name = "tenantId")]
        public string TenantId { get; set; }
        [DataMember(Name = "changeType")]
        public string ChangeType { get; set; }
        [DataMember(Name = "resource")]
        public string Resource { get; set; }
        [DataMember(Name = "resourceData")]
        public ResourceData ResourceData { get; set; }
        [DataMember(Name = "clientState")]
        public string ClientState { get; set; }
    }

    public class ResourceData
    {
        [DataMember(Name = "@odata.type")]
        public string Type { get; set; }
        [DataMember(Name = "@odata.id")]
        public string FullId { get; set; }
        [DataMember(Name = "@odata.etag")]
        public string Etag { get; set; }
        [DataMember(Name = "id")]
        public string ResourceId { get; set; }
    }
}
