using System;

namespace backend.Models;

public class MyFatoorahPaymentResponseDto
{
    public bool Success { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
