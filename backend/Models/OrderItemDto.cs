using System;

namespace backend.Models;

public class OrderItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}
