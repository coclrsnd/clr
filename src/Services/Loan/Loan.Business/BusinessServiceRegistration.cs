using Loan.Business.Concrete;
using Loan.Business.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace Loan.Business
{
    public static class BusinessServiceRegistration
    {
        public static IServiceCollection AddBusinessService(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddScoped<ILoanService, LoanService>();
            return serviceCollection;
        }

    }
}
