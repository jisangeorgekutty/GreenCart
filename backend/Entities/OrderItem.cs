using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class OrderItem
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required]
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    [Required]
    public int Quantity { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

}
