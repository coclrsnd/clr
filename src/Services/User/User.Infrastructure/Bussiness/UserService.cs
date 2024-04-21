using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Transactions;
using User.Application.Contracts.Bussiness;
using User.Application.Contracts.Persistence;
using User.Application.Models.UserManagment;
using User.Domain.Entities;
using User.Infrastructure.Persistence;

namespace User.Infrastructure.Bussiness
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IAsyncRepository<UserRole> _userRoleRepository;
        private readonly IAsyncRepository<UserRoleMapping> _userRoleMappingRepository;
        private readonly IAsyncRepository<RoleAppFeatureMapping> _userRoleAppFeatureMappingRepository;
        private readonly IAsyncRepository<OrganizationConfiguration> _organizationConfigurationRepository;
        private readonly IAsyncRepository<OrganizationUserMapping> _organizationUserMappingRepository;

        public UserService(
            IUserRepository userRepository,
            UserManager<IdentityUser> userManager,
            IMapper mapper,
            IOrganizationRepository organizationRepository,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAsyncRepository<UserRole> userRoleRepository,
            IAsyncRepository<UserRoleMapping> userRoleMappingRepository,
            IAsyncRepository<RoleAppFeatureMapping> userRoleAppFeatureMappingRepository,
            IAsyncRepository<OrganizationConfiguration> organizationConfigurationRepository,
            IAsyncRepository<OrganizationUserMapping> organizationUserMappingRepository)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _mapper = mapper;
            _organizationRepository = organizationRepository;
            _roleManager = roleManager;
            _configuration = configuration;
            _userRoleRepository = userRoleRepository;
            _userRoleMappingRepository = userRoleMappingRepository;
            _userRoleAppFeatureMappingRepository = userRoleAppFeatureMappingRepository;
            _organizationConfigurationRepository = organizationConfigurationRepository;
            _organizationUserMappingRepository = organizationUserMappingRepository;
        }

        public async Task<Domain.Entities.User> GetUsers(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<LoginResponseVm> Login(LoginRequestInput loginRequest)
        {
            try
            {
                var aspNetUser = await _userManager.FindByNameAsync(loginRequest.UserName);
                if (aspNetUser != null && (await _userManager.CheckPasswordAsync(aspNetUser, loginRequest.Password)))
                {
                    string rolesString = string.Empty;
                    List<int> featuresAccess = new List<int>();
                    string currentRole = string.Empty;
                    var user = (await _userRepository.GetAsync(usr => usr.IdentityUserId == aspNetUser.Id)).FirstOrDefault();
                    var roles = (await _userRoleMappingRepository.GetAsync(r => r.UserId == user.Id)).ToList();

                    var organizationUserMapping = (await _organizationUserMappingRepository.GetAsync(exp => exp.UserId == user.Id)).FirstOrDefault();
                    var organization = (await _organizationRepository.GetAsync(org => org.Id == organizationUserMapping.OrganizationId)).FirstOrDefault();

                    var authClaims = new List<Claim>
                    {
                        new Claim("UserId", user.Id+"|"+organization.Id+"|" + user.Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Aud,_configuration["JWT:ValidAudience"]),
                        new Claim(JwtRegisteredClaimNames.Iss,_configuration["JWT:ValidIssuer"]),
                    };

                    foreach (var userRole in roles)
                    {
                        var role = (await _userRoleRepository.GetAsync(ur => ur.Id == userRole.RoleId)).FirstOrDefault();
                        var featuresMappedToRole = (await _userRoleAppFeatureMappingRepository.GetAsync(r => (r.RoleId == userRole.RoleId && (r.IsActive == true || r.IsActive == null)))).ToList();
                        //roleManager.Roles.Where(r => r.Id == userRole.RoleId).FirstOrDefault()?.Name;
                        if (role != null)
                        {
                            rolesString = string.IsNullOrEmpty(rolesString) ? role.Name + "_" + role.Id : rolesString + "," + role.Name + "_" + role.Id;
                        }
                        if (featuresMappedToRole != null && featuresMappedToRole.Count() > 0)
                        {
                            featuresAccess.AddRange(featuresMappedToRole.Select(f => f.FeatureId).ToList());
                        }
                    }

                    authClaims.Add(new Claim(ClaimTypes.Role, rolesString));

                    if (roles != null && roles.Count > 0)
                    {
                        currentRole = rolesString.Split(',').OrderBy(x => x).FirstOrDefault();
                        authClaims.Add(new Claim("CurrentRole", currentRole));
                    }

                    foreach (var feature in featuresAccess.Distinct())
                    {
                        authClaims.Add(new Claim("Features", Convert.ToString(feature)));
                    }

                    var tokenString = GenerateJwtTokenHandler(authClaims);

                    var loginResponse = new LoginResponseVm();
                    loginResponse.Token = tokenString;
                    loginResponse.UserId = user.Id;
                    if (rolesString.ToLower().Contains(UserRoles.SuperAdmin.ToString().ToLower()))
                    {
                        loginResponse.OrganizationId = 0;
                        loginResponse.OrganizationCode = "SUPERGROUP";
                        loginResponse.OrganizationName = "SuperGroup";
                        loginResponse.RoleName = UserRoles.SuperAdmin.ToString();

                    }
                    else
                    {
                        loginResponse.OrganizationId = organization.Id;
                        loginResponse.OrganizationCode = organization.Code;
                        loginResponse.OrganizationName = organization.Name;
                        loginResponse.RoleName = rolesString;
                    }
                    loginResponse.EmailId = user.Email;
                    loginResponse.Name = user.UserName;
                    loginResponse.CurrentRole = currentRole;
                    loginResponse.UserName = user.UserName;
                    loginResponse.LogoPath = (await _organizationConfigurationRepository.GetAsync(oc => oc.OrganizationId == organization.Id)).FirstOrDefault().LogoPath;
                    return loginResponse;
                }
                else
                {
                    throw new Exception("Invalid Username/Password");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error While login");
            }
        }

        public async Task<bool> SignUp(UserSignupRequestInput signupRequestInput)
        {
            var existingUsers = await _userRepository.GetAsync(ex => ex.UserName == signupRequestInput.Email);
            if (existingUsers.Any())
                return false;
            try
            {
                var identityUser = new IdentityUser
                {
                    Email = signupRequestInput.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    PhoneNumber = signupRequestInput.PhoneNumber,
                    UserName = signupRequestInput.Email,
                    EmailConfirmed = true
                };

                var createUserResult = await _userManager.CreateAsync(identityUser, signupRequestInput.Password);

                if (createUserResult.Succeeded)
                {
                    if (!(await _roleManager.RoleExistsAsync(signupRequestInput.SigninAs.ToString())))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(signupRequestInput.SigninAs.ToString()));
                    }

                    await _userManager.AddToRoleAsync(identityUser, signupRequestInput.SigninAs.ToString());

                    var newUser = new Domain.Entities.User
                    {
                        Email = identityUser.Email,
                        PhoneNumber = identityUser.PhoneNumber,
                        UserName = identityUser.Email,
                        IdentityUserId = identityUser.Id
                    };

                    var user = await _userRepository.AddAsync(newUser);

                    var userRole = (await _userRoleRepository.GetAsync(ur => ur.Name == signupRequestInput.SigninAs.ToString())).FirstOrDefault();

                    //Adding new Role incase if role not exists in UserRole
                    if (userRole.Id <= 0)
                    {
                        userRole = (await _userRoleRepository.AddAsync(userRole));
                    }

                    var userRoleMapping = new UserRoleMapping()
                    {
                        UserId = user.Id,
                        RoleId = userRole.Id
                    };

                    await _userRoleMappingRepository.AddAsync(userRoleMapping);


                    var organization = (await _organizationRepository.GetAsync(org => org.Code == signupRequestInput.OrganizationCode)).FirstOrDefault();

                    var organizationUserMapping = new OrganizationUserMapping
                    {
                        OrganizationId = organization != null ? organization.Id : 1,
                        UserId = user.Id
                    };

                    await _organizationUserMappingRepository.AddAsync(organizationUserMapping);
                    return user.Id >= 0;
                }
                else
                {
                    throw new Exception("Error while sign up");
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return false;
        }

        /// <summary>
        /// Shared code for creating the JWT tokenHandler
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="claims"></param>
        /// <returns></returns>
        private string GenerateJwtTokenHandler(IEnumerable<Claim> claims)
        {
            //var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]);
            //var encryptKey = Encoding.ASCII.GetBytes(_configuration["JWT:EncryptSecret"]);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTSecret"]));
            //var key1 = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:EncryptSecret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //var encryptingCredentials = new EncryptingCredentials(key1, JwtConstants.DirectKeyUseAlg, SecurityAlgorithms.Aes256CbcHmacSha512);

            var jwtSecurityToken = new JwtSecurityTokenHandler().CreateJwtSecurityToken(
                _configuration["JWT:ValidAudience"],
                _configuration["JWT:ValidIssuer"],
                new ClaimsIdentity(claims),
                null,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(_configuration["JWT:ExpireTimeInMinutes"])),
                null,
                signingCredentials: creds
                //,encryptingCredentials
                );
            var encryptedJWT = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            return encryptedJWT;
        }


        public async Task<bool> ResetPassword(ResetPasswordRequest model)
        {
            var aspNetUser = await _userManager.FindByNameAsync(model.UserName);
            if (aspNetUser != null && (await _userManager.CheckPasswordAsync(aspNetUser, model.Password)))
            {
                string resetToken = await _userManager.GeneratePasswordResetTokenAsync(aspNetUser);

                IdentityResult resetPasswordResult = await _userManager.ResetPasswordAsync(aspNetUser, resetToken, model.NewPassword);
                if (resetPasswordResult != null && resetPasswordResult.Errors.Any())
                {
                    StringBuilder errorMessage = new();
                    foreach (var err in resetPasswordResult.Errors)
                    {
                        errorMessage.Append(err.Description + " ");
                    }
                    throw new Exception(errorMessage.ToString());
                }
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
