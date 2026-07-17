using System;

namespace backend.Models.Requests;

public class UpdateCartRequest
{
    public Guid UserId { get; set; }
    public List<CartItemDto> CartItems { get; set; } = new();
    
}
