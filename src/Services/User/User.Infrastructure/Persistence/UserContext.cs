using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using User.Application.Models.UserManagment;
using User.Domain.Common;
using User.Domain.Entities;

namespace User.Infrastructure.Persistence
{
    public class UserContext : IdentityDbContext<IdentityUser>
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {
        }
            
        public DbSet<User.Domain.Entities.User> Users { get; set; }
        public DbSet<LoanLead> LoanLeads { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<OrganizationConfiguration> OrganizationConfigurations { get; set; }
        public DbSet<OrganizationUserMapping> OrganizationUserMappings { get; set; }
        public DbSet<AppFeatures> AppFeatures { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<RoleAppFeatureMapping> UserRoleAppFeatureMappings { get; set; }
        public DbSet<UserRoleMapping> UserRoleMappings { get; set; }
        public DbSet<Loans> Loans { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<EntityBase>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedDate = DateTime.UtcNow;
                        entry.Entity.CreatedBy = "swn";
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModifiedDate = DateTime.UtcNow;
                        entry.Entity.LastModifiedBy = "swn";
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Organization>(org =>
            {
                org.HasKey(key => key.Id);

                org.Property(prop => prop.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                org.Property(prop => prop.Code)
                    .IsRequired()
                    .HasMaxLength(100);

                // Relationship with OrganizationUserMapping
                org.HasMany(o => o.OrganizationUsers)
                    .WithOne(oum => oum.Organization)
                    .HasForeignKey(oum => oum.OrganizationId)
                    .OnDelete(DeleteBehavior.Restrict); 

                // Relationship with OrganizationConfiguration
                org.HasMany(o => o.OrganizationConfigurations)
                    .WithOne(oc => oc.Organization)
                    .HasForeignKey(oc => oc.OrganizationId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<User.Domain.Entities.User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(255); 
                entity.Property(e => e.IdentityUserId).HasMaxLength(255); 
                entity.Property(e => e.Email).HasMaxLength(255); 
                entity.Property(e => e.PhoneNumber).HasMaxLength(20); 

                // Relationship with OrganizationUserMapping
                entity.HasMany(u => u.OrganizationUsers)
                    .WithOne(oum => oum.User)
                    .HasForeignKey(oum => oum.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relationship with UserRoleMapping
                entity.HasMany(u => u.UserRoleMappings)
                    .WithOne(urm => urm.User)
                    .HasForeignKey(urm => urm.UserId)
                    .OnDelete(DeleteBehavior.Restrict); 
                                                        
            });

            modelBuilder.Entity<OrganizationConfiguration>(orgConfig =>
            {
                orgConfig.HasKey(key => key.Id);

                orgConfig.Property(prop => prop.LogoPath)
                    .IsRequired()
                    .HasMaxLength(100);

                orgConfig
                    .HasOne(oc => oc.Organization)
                    .WithMany(o => o.OrganizationConfigurations)
                    .HasForeignKey(oc => oc.OrganizationId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<OrganizationUserMapping>(org_usr_mapping =>
            {
                org_usr_mapping.HasKey(uo => new { uo.UserId, uo.OrganizationId });

                org_usr_mapping
                    .HasOne(uo => uo.User)
                    .WithMany(u => u.OrganizationUsers)
                    .HasForeignKey(uo => uo.UserId)
                    .OnDelete(DeleteBehavior.Restrict); ;

                org_usr_mapping
                    .HasOne(uo => uo.Organization)
                    .WithMany(o => o.OrganizationUsers)
                    .HasForeignKey(uo => uo.OrganizationId)
                    .OnDelete(DeleteBehavior.Restrict); 
            });

            modelBuilder.Entity<AppFeatures>(app_feature =>
            {
                // Configure the AppFeatures entity
                app_feature
                    .HasKey(a => a.Id);

                app_feature
                    .Property(a => a.Name)
                    .IsRequired()
                    .HasMaxLength(255); // Adjust the maximum length as needed

                app_feature
                    .Property(a => a.Description)
                    .HasMaxLength(1000); // Adjust the maximum length as needed

                app_feature
                    .Property(ur => ur.IsActive)
                    .HasDefaultValue(true);

                app_feature
                    .HasMany(af => af.RoleAppFeatureMappings)
                    .WithOne(rafm => rafm.Feature)
                    .HasForeignKey(rafm => rafm.FeatureId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Domain.Entities.UserRole>(user_role_featureMapping =>
            {
                // Configure the AppFeatures entity
                user_role_featureMapping
                    .HasKey(a => a.Id);

                user_role_featureMapping
                    .Property(a => a.Name)
                    .IsRequired()
                    .HasMaxLength(255); // Adjust the maximum length as needed

                user_role_featureMapping
                    .Property(a => a.Description)
                    .HasMaxLength(1000); // Adjust the maximum length as needed

                user_role_featureMapping
                    .Property(ur => ur.IsActive)
                    .HasDefaultValue(true);


                user_role_featureMapping
                    .HasMany(ur => ur.UserRoleAppFeatureMapping)
                    .WithOne(rf => rf.Role)
                    .HasForeignKey(rf => rf.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);

                user_role_featureMapping
                    .HasMany(ur => ur.UserRoleMappings)
                    .WithOne(urm => urm.UserRole)
                    .HasForeignKey(urm => urm.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);


            });

            modelBuilder.Entity<RoleAppFeatureMapping>(user_role_feature_mapping =>
            {
                user_role_feature_mapping.HasKey(uraf => uraf.Id);
                user_role_feature_mapping
                    .HasOne(uraf => uraf.Role)
                    .WithMany(ur => ur.UserRoleAppFeatureMapping)
                    .HasForeignKey(uraf => uraf.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);

                user_role_feature_mapping
                    .HasOne(uraf => uraf.Feature)
                    .WithMany(af => af.RoleAppFeatureMappings)
                    .HasForeignKey(uraf => uraf.FeatureId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<UserRoleMapping>(usr_rl_mapping =>
            {
                usr_rl_mapping
                .HasKey(urm => urm.Id);              

                // Configure relationships
                usr_rl_mapping
                    .HasOne(urm => urm.User)
                    .WithMany(u => u.UserRoleMappings)
                    .HasForeignKey(urm => urm.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                usr_rl_mapping
                    .HasOne(urm => urm.UserRole)
                    .WithMany(u => u.UserRoleMappings)
                    .HasForeignKey(urm => urm.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Loans>(loan =>
            {
                loan
                .HasKey(urm => urm.Id);

                // Configure relationships
                loan.Property(prop => prop.AdharNumber)
                    .IsRequired()
                    .HasMaxLength(12);

                loan.Property(prop => prop.Amount)
                    .IsRequired()
                    .HasColumnType("decimal(18, 2)");

                loan.Property(prop => prop.OrganizationCode)
                    .IsRequired()
                    .HasMaxLength(12);

                loan.Property(prop => prop.Status)
                    .IsRequired()
                    .HasMaxLength(12);

                loan.Property(prop => prop.LoanBorrower)
                   .IsRequired()
                   .HasMaxLength(50);

                loan.Property(prop => prop.LoanType)
                  .IsRequired()
                  .HasMaxLength(50);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
