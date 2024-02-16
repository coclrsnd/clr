namespace GraphQLExample.Schema
{
    public class Query
    {
        public string GetHello() => "Hello, GraphQL!";
    }

    public class QueryType : ObjectType<Query>
    {
        protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
        {
            descriptor.Field(q => q.GetHello()).Name("hello");
        }
    }
}   
