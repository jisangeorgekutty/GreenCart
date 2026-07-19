using System;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class GroceryAppContext(DbContextOptions<GroceryAppContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Product> Products { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Address> Addresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasData(new User
        {
            Id = Guid.Parse("8d970b13-fa6c-4861-a083-d9d13db605ff"),
            Name = "System Admin",
            Email = "admin@greencart.com",
            PasswordHash = "AQAAAAIAAYagAAAAEB+wc+7tmTDarzCxlfSNGjaAD5CIxbyZtH3PaLLxEgopuS7nwqRf5VFNl4TjIikdHg==",
            Role = "Admin"
        });
    }
}
