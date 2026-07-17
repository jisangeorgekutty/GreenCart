using System;
using backend.Models;

namespace backend.Services;

public interface ICartService
{
    Task UpdateCartAsync(Guid userId, List<CartItemDto> cartItems);
    Task<GetCartResponse> GetCartAsync(Guid userId);
    Task<bool> ClearCartAsync(Guid userId);
}
