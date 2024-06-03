using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Loan_new_Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecurityReports",
                table: "Loans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VehicleNo",
                table: "Loans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "suretyholder1",
                table: "Loans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "suretyholder1Adhar",
                table: "Loans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "suretyholder2",
                table: "Loans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "suretyholder2Adhar",
                table: "Loans",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SecurityReports",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "VehicleNo",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "suretyholder1",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "suretyholder1Adhar",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "suretyholder2",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "suretyholder2Adhar",
                table: "Loans");
        }
    }
}
