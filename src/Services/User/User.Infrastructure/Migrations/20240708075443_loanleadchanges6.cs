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
                name: "Pancard",
                table: "LoanLeads");

            migrationBuilder.DropColumn(
                name: "Voterid",
                table: "LoanLeads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Pancard",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Voterid",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
