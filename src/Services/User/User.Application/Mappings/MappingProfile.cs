using AutoMapper;
using User.Application.Models.UserManagment;
using User.Domain.Entities;

namespace User.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserSignupRequestInput, User.Domain.Entities.User>().ReverseMap();
            //CreateMap<UserSignupRequestInput, User.Domain.Entities.User>().ReverseMap();
            //CreateMap<Order, CheckoutOrderCommand>().ReverseMap();
            //CreateMap<Order, UpdateOrderCommand>().ReverseMap();
        }
    }
}
