using User.Domain.Entities;

namespace User.Application.Contracts.Persistence
{
    public interface IUserRepository : IAsyncRepository<User.Domain.Entities.User>
    {
        Task<int> AddOrganizationUserMapping(OrganizationUserMapping organizationUserMapping); 
    }
}
