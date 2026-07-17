using System;

namespace backend.Models;

public class VerifyPaymentResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? OrderId { get; set; }
    public decimal? TotalAmount { get; set; }
    public DateTime? OrderDate { get; set; }
    public List<OrderItemDetailDto>? OrderItems { get; set; } = new List<OrderItemDetailDto>();
}
