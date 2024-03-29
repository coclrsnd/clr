using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Domain.Common;
using User.Domain.Entities;

namespace User.Domain.Entities
{
    public class OrganizationUserMapping: EntityBase
    {
        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
