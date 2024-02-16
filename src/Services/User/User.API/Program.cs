
using Ordering.Infrastructure;
using User.Application;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using User.GraphQL;
using User.GraphQL.Schema.Users.Queries;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.EntityFrameworkCore;
using User.Infrastructure.Persistence;
using User.GraphQL.Schema.Loan.Queries;
using User.GraphQL.Schema.Users.Mutations;
using Swashbuckle.AspNetCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();


builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddTypeExtension<UserQueryExtension>()
    .AddTypeExtension<LoanQueryExtension>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<UserMutationExtention>()
    .AddFiltering()
    .AddSorting();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Your GraphQL API",
        Version = "v1",
        Description = "Description of your API"
    });
});

var app = builder.Build();



using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    // Configure database migration
    try
    {
        var context = services.GetRequiredService<UserContext>();
        var logger = services.GetRequiredService<ILogger<UserContextSeed>>();

        // Apply any pending migrations
        context.Database.Migrate();

        // Seed the database if needed
        UserContextSeed.SeedAsync(context, logger).Wait();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating and seeding the database.");
    }

    app.UseSwagger();
    app.UseSwaggerUI();
    // Configure other startup logic here
    // Map GraphQL
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseCors("AllowAll");   

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapBananaCakePop("/graphql/ui").AllowAnonymous();
        endpoints.MapGraphQL();
    });
    
    app.Run();
}


