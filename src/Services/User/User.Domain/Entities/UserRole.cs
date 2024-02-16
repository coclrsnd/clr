using User.Domain.Common;

namespace User.Domain.Entities
{
    public class UserRole : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? IsActive { get; set; }
        public ICollection<RoleAppFeatureMapping> UserRoleAppFeatureMapping { get; set; }
        public ICollection<UserRoleMapping> UserRoleMappings { get; set; }
    }
}
