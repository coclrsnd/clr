using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace User.Application.Models.UserManagment
{
    public class LoginResponseVm
    {
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public string Token { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationCode { get; set; }
        public string OrganizationName { get; set; }
        public string? LogoPath { get; set; }
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public int? UserId { get; set; }
        public string? CurrentRole { get; set; }
        public string? Name { get; set; }
    }
}
