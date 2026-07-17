using System;
using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CartService(GroceryAppContext context) : ICartService
{
    public async Task<bool> ClearCartAsync(Guid userId)
    {
        var existingItems = await context.CartItems
        .Where(c => c.UserId == userId)
        .ToListAsync();

        if (existingItems.Any())
        {
            context.CartItems.RemoveRange(existingItems);
            await context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<GetCartResponse> GetCartAsync(Guid userId)
    {
        var cartItems = await context.CartItems
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto
            {
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                Name = c.Name,
                OfferPrice = c.OfferPrice,
                Image = c.Image,
                Category = c.Category
            })
            .ToListAsync();

        return new GetCartResponse
        {
            UserId = userId,
            CartItems = cartItems
        };
    }

    public async Task UpdateCartAsync(Guid userId, List<CartItemDto> cartItems)
    {
        // Remove existing cart items for this user
        var existingItems = await context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();

        context.CartItems.RemoveRange(existingItems);

        // Add new cart items
        var newItems = cartItems.Select(ci => new CartItem
        {
            UserId = userId,
            ProductId = ci.ProductId,
            Quantity = ci.Quantity,
            OfferPrice = ci.OfferPrice,
            Name = ci.Name,
            Category = ci.Category,
            Image = ci.Image,
        }).ToList();

        await context.CartItems.AddRangeAsync(newItems);
        await context.SaveChangesAsync();
    }
}
