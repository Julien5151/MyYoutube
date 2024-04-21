using System.Reflection;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyYoutubeApi.Migrations
{
    /// <inheritdoc />
    public partial class SetupRoleEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                CREATE TABLE "Roles" (
                    Role VARCHAR(255) UNIQUE
                );
                INSERT INTO "Roles" (Role) VALUES ('Client'), ('Admin');
                ALTER TABLE "Users" ADD CONSTRAINT FK_Users_Role FOREIGN KEY ("Role") REFERENCES "Roles"("role");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE "Users"
                DROP CONSTRAINT "fk_users_role";
                DROP TABLE "Roles";
                """);
            
        }
    }
}
