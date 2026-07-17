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
}
