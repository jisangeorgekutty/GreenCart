using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Entities;

public class Product
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal OfferPrice { get; set; }

    public string Category { get; set; } = string.Empty;

    public bool InStock { get; set; }

    // JSON-serialized string lists
    public string DescriptionJson { get; set; } = "[]";
    public string ImagesJson { get; set; } = "[]";
    [NotMapped]
    public List<string> Description
    {
        get => JsonSerializer.Deserialize<List<string>>(DescriptionJson) ?? new();
        set => DescriptionJson = JsonSerializer.Serialize(value);
    }

    [NotMapped]
    public List<string> Images
    {
        get => JsonSerializer.Deserialize<List<string>>(ImagesJson) ?? new();
        set => ImagesJson = JsonSerializer.Serialize(value);
    }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


