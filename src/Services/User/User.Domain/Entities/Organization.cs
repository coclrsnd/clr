using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Domain.Common;

namespace User.Domain.Entities
{
    public class Organization : EntityBase
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public ICollection<OrganizationUserMapping> OrganizationUsers { get; set; }
        public ICollection<OrganizationConfiguration> OrganizationConfigurations { get; set; }

    }
}
