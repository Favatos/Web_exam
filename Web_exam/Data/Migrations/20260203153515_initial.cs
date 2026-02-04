using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_exam.Data.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Nonograms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SolutionJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nonograms", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Nonograms",
                columns: new[] { "Id", "Difficulty", "Name", "SolutionJson" },
                values: new object[] { 1, "Medium", "Harry Potter", "[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0],[0,1,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0],[0,1,1,0,0,1,1,0,0,1,0,0,0,1,1,1,0,0],[0,0,1,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1],[0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1],[1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,1],[1,1,1,0,0,0,1,0,0,1,1,0,0,1,1,0,0,1],[0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],[0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,0],[0,0,1,0,0,1,1,0,0,1,0,0,0,1,1,1,1,0],[0,1,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0],[0,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0]]" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Nonograms");
        }
    }
}
