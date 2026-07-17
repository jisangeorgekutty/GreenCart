using System;

namespace backend.Models;

public class ProductResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal OfferPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool InStock { get; set; }
    public List<string> Description { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


