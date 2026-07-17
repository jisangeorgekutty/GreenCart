using System;
using backend.Data;
using backend.Entities;
using backend.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ProductService(GroceryAppContext context, Cloudinary cloudinary) : IProductService
{
    public async Task AddProductAsync(ProductCreateDto productDto, IEnumerable<IFormFile> images)
    {
        Console.WriteLine("Dta"+productDto);
        var imageUrls = new List<string>();

        if (images != null)
        {
            foreach (var file in images)
            {
                if (file.Length <= 0) continue;

                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                };
                var uploadResult = await cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error == null && !string.IsNullOrEmpty(uploadResult.SecureUrl?.ToString()))
                {
                    imageUrls.Add(uploadResult.SecureUrl.ToString());
                }
            }
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description ?? new List<string>(),
            Price = productDto.Price,
            OfferPrice = productDto.OfferPrice,
            Category = productDto.Category,
            InStock = productDto.InStock,
            Images = imageUrls
        };

        context.Products.Add(product);
        await context.SaveChangesAsync();
    }

    public async Task<List<ProductResponseDto>> GetAllProductsAsync()
    {
        return await context.Products
            .AsNoTracking()
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                OfferPrice = p.OfferPrice,
                Category = p.Category,
                InStock = p.InStock,
                Description = p.Description,
                Images = p.Images,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) return null;
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            OfferPrice = product.OfferPrice,
            Category = product.Category,
            InStock = product.InStock,
            Description = product.Description,
            Images = product.Images,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task ChangeStockAsync(Guid id, bool inStock)
    {
        var product = await context.Products.FindAsync(id);
        if (product is null)
        {
            throw new KeyNotFoundException("Product not found");
        }
        product.InStock = inStock;
        await context.SaveChangesAsync();
    }

}
