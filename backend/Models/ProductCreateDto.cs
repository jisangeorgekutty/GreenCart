using System;

namespace backend.Models;

public class ProductCreateDto
{
    public string Name { get; set; } = string.Empty;
    public List<string> Description { get; set; } = new();
    public decimal Price { get; set; }
    public decimal OfferPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool InStock { get; set; } = true;
}
