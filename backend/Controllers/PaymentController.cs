// using backend.Services;
// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;

// namespace backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class PaymentController(IOrderService orderService) : ControllerBase
//     {
//         [HttpGet("success")]
//         public async Task<IActionResult> PaymentSuccess([FromQuery] string paymentId)
//         {
//             if (string.IsNullOrEmpty(paymentId))
//             {
//                 return BadRequest("PaymentId is required.");
//             }
//             var result = await orderService.VerifyMyFatoorahPaymentAsync(paymentId);

//             if (result.Success)
//             {
//                 return Redirect("http://localhost:5173/payment-success");  // Frontend success page
//             }
//             else
//             {
//                 return Redirect("http://localhost:5173/payment-failure");  // Frontend failure page
//             }
//         }

//         [HttpGet("fail")]
//         public IActionResult PaymentFail()
//         {
//             return Redirect("http://localhost:5173/payment-failure");
//         }
//     }
// }
