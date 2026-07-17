using System;
using System.Text;
using System.Text.Json;
using backend.Data;
using backend.Entities;
using backend.Models;
using backend.Models.Requests;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class OrderService(GroceryAppContext context, HttpClient httpClient) : IOrderService
{

    public async Task<List<AllOrderResponseDto>> GetAllOrdersAsync()
    {
        var orders = await context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Where(o => o.PaymentType == "COD" || o.IsPaid)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return orders.Select(MapAllOrderToDto).ToList();
    }

    public async Task<List<OrderResponseDto>> GetUserOrdersAsync(Guid userId)
    {
        var orders = await context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId && (o.PaymentType == "COD" || o.IsPaid))
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapOrderToDto).ToList();
    }

    public async Task<bool> PlaceOrderCODAsync(PlaceOrderRequest request)
    {
        if (request == null || !request.Items.Any() || string.IsNullOrEmpty(request.Address))
        {
            return false;
        }
        decimal amount = 0;
        foreach (var item in request.Items)
        {
            var product = await context.Products.FindAsync(item.ProductId);
            if (product == null)
            {
                continue;
            }
            decimal lineTotal = product.OfferPrice * item.Quantity;


            amount += lineTotal;
        }
        decimal tax = Math.Round(amount * 0.02m, 2); // 2% tax
        amount += tax;

        Console.WriteLine($"Total amount after tax: {amount}");

        var order = new Order
        {
            UserId = request.UserId,
            Address = request.Address,
            Amount = amount,
            PaymentType = "COD",
            Items = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity
            }).ToList()
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<MyFatoorahPaymentResponseDto> PlaceOrderWithMyFatoorahAsync(MyFatoorahPaymentRequestDto request, string origin)
    {
        try
        {
            if (request.Items == null || !request.Items.Any())
                return new MyFatoorahPaymentResponseDto { Success = false, Message = "Invalid Data" };

            decimal amount = 0;
            foreach (var item in request.Items)
            {
                var product = await context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    continue;
                }
                decimal lineTotal = product.OfferPrice * item.Quantity;


                amount += lineTotal;
            }
            decimal tax = Math.Round(amount * 0.02m, 2);
            amount += tax;
            Console.WriteLine($"Total amount after tax: {amount}");

            var order = new Order
            {
                UserId = request.UserId,
                Address = request.Address != null
        ? $"{request.Address.FirstName} {request.Address.LastName}, {request.Address.Street}, {request.Address.City}"
        : string.Empty,
                Amount = amount,
                PaymentType = "Online",
                Items = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList(),
                IsPaid = false,
                CreatedAt = DateTime.UtcNow
            };

            Console.WriteLine($"Placing order with amount: {amount} and address: {order}");

            context.Orders.Add(order);
            await context.SaveChangesAsync();

            var paymentData = new
            {
                PaymentMethodId = 2,
                CustomerName = request.Address?.FirstName ?? "Customer",
                DisplayCurrencyIso = "KWD",
                MobileCountryCode = "+965",
                CustomerMobile = request.Address?.Phone ?? "00000000",
                CustomerEmail = request.Address?.Email ?? "test@example.com",
                InvoiceValue = amount,
                CallBackUrl = $"{origin}/payment/success",
                ErrorUrl = $"{origin}/payment/failed",
                Language = "en",
                CustomerReference = order.Id.ToString()
            };



            Console.WriteLine($"Payment data: {JsonSerializer.Serialize(paymentData)}");

            var json = JsonSerializer.Serialize(paymentData);
            var response = await httpClient.PostAsync("/v2/ExecutePayment",
                new StringContent(json, Encoding.UTF8, "application/json"));

            if (!response.IsSuccessStatusCode)
                return new MyFatoorahPaymentResponseDto { Success = false, Message = "Payment initiation failed" };

            var responseData = JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync());
            var paymentUrl = responseData.GetProperty("Data").GetProperty("PaymentURL").GetString();

            return new MyFatoorahPaymentResponseDto
            {
                Success = true,
                Url = paymentUrl ?? string.Empty,
                Message = "Redirect to MyFatoorah"
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error placing order with MyFatoorah: {ex.Message}");
            return new MyFatoorahPaymentResponseDto { Success = false, Message = "An error occurred while processing the payment" };
        }

    }

    public async Task<VerifyPaymentResponseDto> VerifyMyFatoorahPaymentAsync(string paymentId)
    {
        var verifyData = new { Key = paymentId, KeyType = "PaymentId" };
        var json = JsonSerializer.Serialize(verifyData);

        var response = await httpClient.PostAsync("/v2/GetPaymentStatus",
            new StringContent(json, Encoding.UTF8, "application/json"));

        if (!response.IsSuccessStatusCode)
            return new VerifyPaymentResponseDto { Success = false, Message = "Verification failed" };

        var responseBody = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<JsonElement>(responseBody);

        if (!data.TryGetProperty("Data", out var dataProperty))
            return new VerifyPaymentResponseDto { Success = false, Message = "Invalid response format: missing Data property" };

        var status = dataProperty.GetProperty("InvoiceStatus").GetString() ?? "";
        var customerRef = dataProperty.GetProperty("CustomerReference").GetString();

        if (string.IsNullOrEmpty(customerRef))
        {
            return new VerifyPaymentResponseDto { Success = false, Message = "CustomerReference is missing in response." };
        }

        if (!Guid.TryParse(customerRef, out var orderId))
        {
            return new VerifyPaymentResponseDto { Success = false, Message = "CustomerReference is not a valid GUID." };
        }

        var order = await context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return new VerifyPaymentResponseDto { Success = false, Message = "Order not found for CustomerReference." };
        }

        if (status == "Paid")
        {
            order.IsPaid = true;
            await context.SaveChangesAsync();

            var successDto = new VerifyPaymentResponseDto
            {
                Success = true,
                Message = "Payment Successful",
                OrderId = order.Id,
                TotalAmount = order.Amount, // Assuming you have a TotalAmount property
                OrderDate = order.CreatedAt, // Assuming you have a CreatedAt property
                OrderItems = order.Items
                .Select(oi => new OrderItemDetailDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    OfferPrice = oi.Product.OfferPrice,
                    Images = oi.Product?.Images ?? new List<string>(),
                    Category = oi.Product?.Category ?? string.Empty
                })
                .ToList()
            };

            return successDto;
        }
        else
        {
            return new VerifyPaymentResponseDto { Success = false, Message = $"Payment Status: {status}", OrderId = order.Id };
        }

    }

    private OrderResponseDto MapOrderToDto(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            Amount = order.Amount,
            Address = order.Address,
            Status = order.Status,
            PaymentType = order.PaymentType,
            IsPaid = order.IsPaid,
            CreatedAt = order.CreatedAt,
            Items = order.Items.Select(i => new OrderItemDetailDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? string.Empty,
                OfferPrice = i.Product?.OfferPrice ?? 0,
                Quantity = i.Quantity,
                Images = i.Product?.Images ?? new List<string>(),
                Category = i.Product?.Category ?? string.Empty
            }).ToList()
        };
    }

    private AllOrderResponseDto MapAllOrderToDto(Order order)
    {

        return new AllOrderResponseDto
        {
            Id = order.Id,
            Amount = order.Amount,
            Address = order.Address,
            Status = order.Status,
            PaymentType = order.PaymentType,
            IsPaid = order.IsPaid,
            CreatedAt = order.CreatedAt,
            Name = order.User?.Name ?? string.Empty,
            Items = order.Items.Select(i => new OrderItemDetailDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? string.Empty,
                OfferPrice = i.Product?.OfferPrice ?? 0,
                Quantity = i.Quantity,
                Images = i.Product?.Images ?? new List<string>(),
                Category = i.Product?.Category ?? string.Empty
            }).ToList()
        };
    }

}




