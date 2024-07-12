using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class loanleadchanges6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PanCardNumber",
                table: "LoanLeads");

            migrationBuilder.DropColumn(
                name: "VoterId",
                table: "LoanLeads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PanCardNumber",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VoterId",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
