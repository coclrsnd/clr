using User.Domain.Entities;

namespace User.Application.Contracts.Persistence
{
    public interface IOrganizationRepository : IAsyncRepository<Organization>
    {
    }
}
