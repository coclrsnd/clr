using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangingLoanstatusDataType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Loans",
                type: "character varying(12)",
                maxLength: 12,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldMaxLength: 12);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Loans",
                type: "integer",
                maxLength: 12,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(12)",
                oldMaxLength: 12);
        }
    }
}
