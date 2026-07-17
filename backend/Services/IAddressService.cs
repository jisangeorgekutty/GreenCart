using System;
using backend.Models;

namespace backend.Services;

public interface IAddressService
{
    Task<bool> AddAddressAsync(AddressDto addressDto);
    Task<List<AddressResponseDto>> GetUserAddressAsync(Guid userId);
}
