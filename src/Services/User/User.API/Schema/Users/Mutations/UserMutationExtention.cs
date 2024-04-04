using AutoMapper;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using User.Api.Types;
using User.Application.Contracts.Bussiness;
using User.Application.Models.UserManagment;
using User.Domain.Entities;
using User.GraphQL.Extensions;
using User.Infrastructure.Persistence;
using static HotChocolate.ErrorCodes;

namespace User.GraphQL.Schema.Users.Mutations
{
    [ExtendObjectType(HotChocolate.Language.OperationType.Mutation)]
    public class UserMutationExtention
    {
        private readonly IMapper _mapper;

        public UserMutationExtention(IMapper mapper)
        {
            _mapper = mapper;
        }

        public async Task<bool> CreateUser([Service] IUserService _userService, UserSignupRequestInput userSignupRequestInput)
        {
            try
            {
                return await _userService.SignUp(userSignupRequestInput);
            }
            catch (Exception ex)
            {
                throw new Exception("Error While Signing up");
            }
        }

        [UseApplicationDbContext]
        public async Task<int> SaveLoan([ScopedService] UserContext context, LoanRequestModel loanRequestInput, CancellationToken cancellationToken)
        {
            try
            {
                if (loanRequestInput.Id <= 0)
                {
                    var loan = _mapper.Map<Loans>(loanRequestInput);
                    var loanEntity = await context.Loans.AddAsync(loan);
                    await context.SaveChangesAsync();
                    return loanEntity.Entity.Id;
                }
                else
                {
                    var loan = _mapper.Map<Loans>(loanRequestInput);
                    var loanEntity = context.Loans.Update(loan);
                    await context.SaveChangesAsync();
                    return loanEntity.Entity.Id;
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Error While Signing up");
            }
        }        
    }
}
