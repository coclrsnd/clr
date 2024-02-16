using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Domain.Common;

namespace User.Domain.Entities
{
    public class User : EntityBase
    {
        public string UserName { get; set; }
        public string IdentityUserId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public ICollection<OrganizationUserMapping> OrganizationUsers { get; set; }
        public ICollection<UserRoleMapping> UserRoleMappings { get; set; }
    }
}
