using AutoMapper;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;
using User.Application.Contracts.Bussiness;
using User.Application.Models.UserManagment;

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

        public async Task<bool> ResetPassword([Service] IUserService _userService, ResetPasswordRequest resetPasswordRequest)
        {
            try
            {
                return await _userService.ResetPassword(resetPasswordRequest);
            }
            catch (Exception ex)
            {
                throw new Exception("Error While Signing up");
            }
        }
    }
}
