using System;
using backend.Models;

namespace backend.Services;

public interface IProductService
{
    Task AddProductAsync(ProductCreateDto productDto, IEnumerable<IFormFile> images);
    Task<List<ProductResponseDto>> GetAllProductsAsync();
    Task<ProductResponseDto?> GetByIdAsync(Guid id);
    Task ChangeStockAsync(Guid id,bool inStock);
}
