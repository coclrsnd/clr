using Microsoft.Extensions.Logging;
using User.Domain.Entities;

namespace User.Infrastructure.Persistence
{
    public class UserContextSeed
    {
        public static async Task SeedAsync(UserContext userContext, ILogger<UserContextSeed> logger)
        {
            if (!userContext.Organizations.Any())
            {
                userContext.Organizations.AddRange(GetOrganization());
                await userContext.SaveChangesAsync();
                logger.LogInformation("Seed database associated with context {DbContextName}", typeof(UserContext).Name);
            }

            if (!userContext.OrganizationConfigurations.Any())
            {
                var organizationConfiguration = new List<OrganizationConfiguration>()
                {
                    new OrganizationConfiguration()
                    {
                        OrganizationId = 1,
                        LogoPath = "../assets/images/logo.png"
                    },
                     new OrganizationConfiguration()
                    {
                         OrganizationId = 2,
                         LogoPath = "../assets/images/logo.png"
                    }
                };
                userContext.OrganizationConfigurations.AddRange(organizationConfiguration);
                await userContext.SaveChangesAsync();
                logger.LogInformation("Seed database associated with context {DbContextName}", typeof(UserContext).Name);
            }

            if (!userContext.AppFeatures.Any())
            {

                userContext.AppFeatures.AddRange(GetAppFeatures());
                await userContext.SaveChangesAsync();
                logger.LogInformation("Seed database associated with context {DbContextName}", typeof(UserContext).Name);

            }

            if (!userContext.UserRole.Any())
            {
                userContext.UserRole.AddRange(GetUserRoles());
                await userContext.SaveChangesAsync();
                logger.LogInformation("Seed database associated with context {DbContextName}", typeof(UserContext).Name);

            }

            if (!userContext.UserRoleAppFeatureMappings.Any())
            {
                var userRoleAppFeatureMappings = new List<RoleAppFeatureMapping>()
                {
                    new RoleAppFeatureMapping()
                    {
                        RoleId = userContext.UserRole.FirstOrDefault(ex=>ex.Name.ToLower() == "admin").Id,
                        FeatureId = userContext.AppFeatures.FirstOrDefault(ex => ex.Name.ToLower() == "dashboard").Id
                    },
                    new RoleAppFeatureMapping()
                    {
                        RoleId = userContext.UserRole.FirstOrDefault(ex=>ex.Name.ToLower() == "admin").Id,
                        FeatureId = userContext.AppFeatures.FirstOrDefault(ex => ex.Name.ToLower() == "admin").Id
                    },
                    new RoleAppFeatureMapping()
                    {
                        RoleId = userContext.UserRole.FirstOrDefault(ex=>ex.Name.ToLower() == "devsupport").Id,
                        FeatureId = userContext.AppFeatures.FirstOrDefault(ex => ex.Name.ToLower() == "dashboard").Id
                    },

                };
                userContext.UserRoleAppFeatureMappings.AddRange(userRoleAppFeatureMappings);
                await userContext.SaveChangesAsync();
                logger.LogInformation("Seed database associated with context {DbContextName}", typeof(UserContext).Name);
            }
        }

        public static IEnumerable<Organization> GetOrganization()
        {
            return new List<Organization>
            {
                new Organization() {Name = "Org 1", Code = "ORG1" },
                new Organization() {Name = "Org 2", Code = "ORG2" }
            };
        }


        public static IEnumerable<AppFeatures> GetAppFeatures()
        {
            return
            new List<AppFeatures>{
                new AppFeatures
                {
                    Name = "DashBoard",
                    Description = "DashBoard",
                    IsActive = true,

                },
                    new AppFeatures
                    {
                        Name = "Admin",
                        Description = "Admin",
                        IsActive = true,
                    }
                 };
        }
        public static IEnumerable<UserRole> GetUserRoles()
        {
            return new List<UserRole>
            {
                new UserRole
                {
                    Name = "DevSupport",
                    Description = "Dev Support Role",
                    IsActive = true
                },
                new UserRole
                {
                    Name = "Admin",
                    Description = "Admin User Role",
                    IsActive = true
                }
            };
        }
    }
}
