using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("8d970b13-fa6c-4861-a083-d9d13db605ff"), "admin@greencart.com", "System Admin", "AQAAAAIAAYagAAAAEB+wc+7tmTDarzCxlfSNGjaAD5CIxbyZtH3PaLLxEgopuS7nwqRf5VFNl4TjIikdHg==", null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8d970b13-fa6c-4861-a083-d9d13db605ff"));
        }
    }
}
