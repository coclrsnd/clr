using User.Application.Contracts.Persistence;
using User.Domain.Entities;
using User.Infrastructure.Persistence;

namespace User.Infrastructure.Repositories
{
    public class UserRepository : RepositoryBase<User.Domain.Entities.User>, IUserRepository
    {
        public UserRepository(UserContext dbContext) : base(dbContext)
        {
        }

        public Task<int> AddOrganizationUserMapping(OrganizationUserMapping organizationUserMapping)
        {
            _dbContext.OrganizationUserMappings.AddAsync(organizationUserMapping);
            return _dbContext.SaveChangesAsync();
        }
    }
}
