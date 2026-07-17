using System;

namespace backend.Models;

public class GetCartResponse
{
    public Guid UserId { get; set; }
    public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
}
