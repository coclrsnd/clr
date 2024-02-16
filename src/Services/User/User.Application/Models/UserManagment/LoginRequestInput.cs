namespace User.Application.Models.UserManagment
{
    public record LoginRequestInput(
       string UserName,
       string Password,
       string OrganizationCode);
}
