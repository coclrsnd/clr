using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UserMappingchanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "OrganizationUserMappings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "OrganizationUserMappings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "OrganizationUserMappings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "OrganizationUserMappings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                table: "OrganizationUserMappings",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "OrganizationUserMappings");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "OrganizationUserMappings");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "OrganizationUserMappings");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "OrganizationUserMappings");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                table: "OrganizationUserMappings");
        }
    }
}
