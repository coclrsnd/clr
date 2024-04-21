namespace User.Application.Models.UserManagment
{
    public class ResetPasswordRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}
