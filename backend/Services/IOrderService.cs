using System;
using backend.Models;
using backend.Models.Requests;

namespace backend.Services;

public interface IOrderService
{
    Task<bool> PlaceOrderCODAsync(PlaceOrderRequest request);
    Task<List<OrderResponseDto>> GetUserOrdersAsync(Guid userId);
    Task<List<AllOrderResponseDto>> GetAllOrdersAsync();
    Task<MyFatoorahPaymentResponseDto> PlaceOrderWithMyFatoorahAsync(MyFatoorahPaymentRequestDto request, string origin);
    Task<VerifyPaymentResponseDto> VerifyMyFatoorahPaymentAsync(string paymentId);
}


