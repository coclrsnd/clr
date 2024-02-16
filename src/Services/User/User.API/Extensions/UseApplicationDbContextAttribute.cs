using HotChocolate.Types.Descriptors;
using HotChocolate.Types;
using System.Reflection;
using User.Infrastructure.Persistence;
using HotChocolate.Types.Descriptors;


namespace User.GraphQL.Extensions
{
    public class UseApplicationDbContextAttribute : ObjectFieldDescriptorAttribute
    {
        protected override void OnConfigure(IDescriptorContext context, IObjectFieldDescriptor descriptor, MemberInfo member)
        {
            descriptor.UseDbContext<UserContext>();
        }
    }
}
