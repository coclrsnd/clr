using AutoMapper;
using ConferencePlanner.GraphQL.Types;
using User.Api.Types;
using User.Application.Models.UserManagment;

namespace User.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserSignupRequestInput, User.Domain.Entities.User>().ReverseMap();
            CreateMap<LoanRequestModel, User.Domain.Entities.Loans>().ReverseMap();
            CreateMap<LoanLeadRequestModel, User.Domain.Entities.LoanLead>().ReverseMap();
            CreateMap<OrganizationRequest, User.Domain.Entities.Organization>().ReverseMap();
        }
    }
}
