using System;

namespace backend.Models;

public class OrderResponseDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentType { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDetailDto> Items { get; set; } = new();

}
