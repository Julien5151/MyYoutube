using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyYoutubeApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMusicOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "Musics",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Musics_OwnerId",
                table: "Musics",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Musics_Users_OwnerId",
                table: "Musics",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Musics_Users_OwnerId",
                table: "Musics");

            migrationBuilder.DropIndex(
                name: "IX_Musics_OwnerId",
                table: "Musics");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Musics");
        }
    }
}
