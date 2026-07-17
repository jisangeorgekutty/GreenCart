using System;

namespace backend.Models;

public class OrderItemDetailDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal OfferPrice { get; set; }
    public int Quantity { get; set; }
    public List<string> Images { get; set; } = new();
    public string Category { get; set; } = string.Empty;
}
