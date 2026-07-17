using System;

namespace backend.Models.Requests;

public class PlaceOrderRequest
{
    public Guid UserId { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();

    public string Address { get; set; } = string.Empty;
}
