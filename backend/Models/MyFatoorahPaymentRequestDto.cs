using System;

namespace backend.Models;

public class MyFatoorahPaymentRequestDto
{
    public Guid UserId { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public AddressDto Address { get; set; } = new();
}
