using User.Domain.Common;

namespace User.Domain.Entities
{
    public class AppFeatures : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public ICollection<RoleAppFeatureMapping> RoleAppFeatureMappings { get; set; }
    }
}
