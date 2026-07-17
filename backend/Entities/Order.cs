using System;
using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;

namespace backend.Entities;

public class Order
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = new();
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = "Order Placed";
    [Required]
    public string PaymentType { get; set; } = "COD";
    public bool IsPaid { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
