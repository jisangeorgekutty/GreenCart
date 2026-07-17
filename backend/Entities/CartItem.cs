using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;

public class CartItem
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // Foreign key to User
    [Required]
    public Guid UserId { get; set; }
    public User? User { get; set; }

    // Foreign key to Product
    [Required]
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public int Quantity { get; set; }
    public decimal OfferPrice { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
}
