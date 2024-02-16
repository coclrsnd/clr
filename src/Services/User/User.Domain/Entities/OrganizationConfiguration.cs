using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Domain.Common;

namespace User.Domain.Entities
{
    public class OrganizationConfiguration : EntityBase
    {
        public int OrganizationId { get; set; }
        public string LogoPath { get; set; }
        public Organization Organization { get; set; }
    }
}
