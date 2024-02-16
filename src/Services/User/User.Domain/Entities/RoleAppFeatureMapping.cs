using User.Domain.Common;

namespace User.Domain.Entities
{
    public class RoleAppFeatureMapping : EntityBase
    {
        public int RoleId { get; set; }        
        public UserRole Role { get; set; }
        public int FeatureId { get; set; }
        public AppFeatures Feature { get; set; }
        public bool? IsActive { get; set; }
    }
}
