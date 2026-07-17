using System;
using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AddressService(GroceryAppContext context) : IAddressService
{
    public async Task<bool> AddAddressAsync(AddressDto addressDto)
    {
        var address = new Address
        {
            UserId = addressDto.UserId,
            FirstName = addressDto.FirstName,
            LastName = addressDto.LastName,
            Email = addressDto.Email,
            Street = addressDto.Street,
            City = addressDto.City,
            State = addressDto.State,
            ZipCode = addressDto.ZipCode,
            Country = addressDto.Country,
            Phone = addressDto.Phone
        };

        context.Addresses.Add(address);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<List<AddressResponseDto>> GetUserAddressAsync(Guid userId)
    {
        return await context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AddressResponseDto
            {
                Id = a.Id,
                UserId = a.UserId,
                FirstName = a.FirstName,
                LastName = a.LastName,
                Email = a.Email,
                Street = a.Street,
                City = a.City,
                State = a.State,
                ZipCode = a.ZipCode,
                Country = a.Country,
                Phone = a.Phone,
                CreatedAt = a.CreatedAt
            })
           .ToListAsync();
    }
}

