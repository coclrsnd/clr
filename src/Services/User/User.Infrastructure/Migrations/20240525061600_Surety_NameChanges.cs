using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Surety_NameChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "suretyholder2Adhar",
                table: "Loans",
                newName: "Suretyholder2Adhar");

            migrationBuilder.RenameColumn(
                name: "suretyholder2",
                table: "Loans",
                newName: "Suretyholder2");

            migrationBuilder.RenameColumn(
                name: "suretyholder1Adhar",
                table: "Loans",
                newName: "Suretyholder1Adhar");

            migrationBuilder.RenameColumn(
                name: "suretyholder1",
                table: "Loans",
                newName: "Suretyholder1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Suretyholder2Adhar",
                table: "Loans",
                newName: "suretyholder2Adhar");

            migrationBuilder.RenameColumn(
                name: "Suretyholder2",
                table: "Loans",
                newName: "suretyholder2");

            migrationBuilder.RenameColumn(
                name: "Suretyholder1Adhar",
                table: "Loans",
                newName: "suretyholder1Adhar");

            migrationBuilder.RenameColumn(
                name: "Suretyholder1",
                table: "Loans",
                newName: "suretyholder1");
        }
    }
}
