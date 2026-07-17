namespace backend.Models;

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal OfferPrice { get; set; }
    public string Image { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
