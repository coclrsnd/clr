using User.Application.Models.UserManagment;

namespace User.Application.Contracts.Bussiness
{
    public interface IUserService
    {
        Task<Domain.Entities.User> GetUsers(int id);

        Task<LoginResponseVm> Login(LoginRequestInput loginRequestInput);

        Task<bool> SignUp(UserSignupRequestInput signupRequestInput);
    }
}
