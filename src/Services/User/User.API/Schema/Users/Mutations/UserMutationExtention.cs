using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;
using User.Application.Contracts.Bussiness;
using User.Application.Models.UserManagment;
using User.Domain.Entities;

namespace User.GraphQL.Schema.Users.Mutations
{
    [ExtendObjectType(HotChocolate.Language.OperationType.Mutation)]
    public class UserMutationExtention
    {


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
    }
}
