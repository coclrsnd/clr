using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Contracts.Bussiness;
using User.Application.Models.UserManagment;
using User.Domain.Entities;
using User.GraphQL.Extensions;
using User.Infrastructure.Persistence;

namespace User.GraphQL.Schema.Users.Queries
{
    [ExtendObjectType(HotChocolate.Language.OperationType.Query)]
    public class UserQueryExtension
    {
        public async Task<LoginResponseVm> Login([Service] IUserService userService, LoginRequestInput loginRequestInput)
        {
            try
            {
                return await userService.Login(loginRequestInput);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [UseApplicationDbContext]
        [UseFiltering]
        public async Task<IEnumerable<User.Domain.Entities.User>> GetUsers(
           [ScopedService] UserContext context, CancellationToken cancellationToken) =>
            await context.Users
                .Include(u=>u.OrganizationUsers)
                .Include(u=>u.UserRoleMappings)
                .ToListAsync(cancellationToken);

        [UseApplicationDbContext]
        [UseFiltering]
        public async Task<IEnumerable<User.Domain.Entities.Organization>> GetOrganization(
         [ScopedService] UserContext context, CancellationToken cancellationToken) =>
          await context.Organizations.ToListAsync(cancellationToken);

        [UseApplicationDbContext]
        [UseFiltering]
        public async Task<IEnumerable<User.Domain.Entities.UserRole>> GetRoles(
         [ScopedService] UserContext context, CancellationToken cancellationToken) =>
          await context.UserRole.ToListAsync(cancellationToken);

    }
}
