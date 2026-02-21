using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_exam.Data.Migrations
{
    /// <inheritdoc />
    public partial class SmallChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Nonograms",
                keyColumn: "Id",
                keyValue: 1,
                column: "Difficulty",
                value: "Hard");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Nonograms",
                keyColumn: "Id",
                keyValue: 1,
                column: "Difficulty",
                value: "Medium");
        }
    }
}
