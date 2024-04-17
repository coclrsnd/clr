namespace User.Application.Models.UserManagment
{
    public record UserSignupRequestInput(
        string? UserName,
        string PhoneNumber,
        string Email,
        string Password,
        string OrganizationCode,
        UserRoles SigninAs = UserRoles.Officers);

    public enum UserRoles
    {
        DevSupport,
        Admin,
        SuperAdmin,
        Officers
    }
}
