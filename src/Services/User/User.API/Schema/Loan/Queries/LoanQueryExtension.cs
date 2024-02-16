using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using User.Domain.Entities;
using User.GraphQL.Extensions;
using User.Infrastructure.Persistence;

namespace User.GraphQL.Schema.Loan.Queries
{
    [ExtendObjectType(HotChocolate.Language.OperationType.Query)]
    public class LoanQueryExtension
    {
        [UseApplicationDbContext]
        [UseFiltering]
        public async Task<IEnumerable<Loans>> GetLoans(
           [ScopedService] UserContext context, CancellationToken cancellationToken) =>
           await context.Loans.ToListAsync(cancellationToken);

    }
}
