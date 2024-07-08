using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class leadchanges4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "leadstage",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "leadstatus",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "leadstatusremarks",
                table: "LoanLeads",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "leadstage",
                table: "LoanLeads");

            migrationBuilder.DropColumn(
                name: "leadstatus",
                table: "LoanLeads");

            migrationBuilder.DropColumn(
                name: "leadstatusremarks",
                table: "LoanLeads");
        }
    }
}
