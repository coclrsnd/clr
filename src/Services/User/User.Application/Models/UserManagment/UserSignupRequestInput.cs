namespace User.Application.Models.UserManagment
{
    public record UserSignupRequestInput(
        string? UserName,
        string PhoneNumber,
        string Email,
        string Password,
        string OrganizationCode,
        UserRoles SigninAs = UserRoles.Admin);

    public enum UserRoles
    {
        DevSupport,
        Admin
    }
}
