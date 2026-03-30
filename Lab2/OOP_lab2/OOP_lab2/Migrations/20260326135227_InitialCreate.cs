using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OOP_lab2.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Technics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Technics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Computers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    ModelProcessor = table.Column<string>(type: "text", nullable: false),
                    Ram = table.Column<int>(type: "integer", nullable: false),
                    TechnicId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Computers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Computers_Technics_Id",
                        column: x => x.Id,
                        principalTable: "Technics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Computers_Technics_TechnicId",
                        column: x => x.TechnicId,
                        principalTable: "Technics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Smartfons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    CameraMP = table.Column<int>(type: "integer", nullable: false),
                    IsCall = table.Column<bool>(type: "boolean", nullable: false),
                    Manufactures = table.Column<string>(type: "text", nullable: false),
                    TechnicId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Smartfons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Smartfons_Technics_Id",
                        column: x => x.Id,
                        principalTable: "Technics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Smartfons_Technics_TechnicId",
                        column: x => x.TechnicId,
                        principalTable: "Technics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Computers_TechnicId",
                table: "Computers",
                column: "TechnicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Smartfons_TechnicId",
                table: "Smartfons",
                column: "TechnicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Computers");

            migrationBuilder.DropTable(
                name: "Smartfons");

            migrationBuilder.DropTable(
                name: "Technics");
        }
    }
}
