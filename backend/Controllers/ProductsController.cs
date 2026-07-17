using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(IProductService productService, ILogger<ProductsController> logger) : ControllerBase
    {
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> AddProduct([FromForm] IFormCollection form)
        {
            try
            {
                if (!form.TryGetValue("productData", out var productDataValue))
                    return BadRequest("Missing productData field");

                foreach (var key in form.Keys)
                {
                    logger.LogInformation("Form key: {Key} => {Value}", key, form[key]);
                }
                var productDto = System.Text.Json.JsonSerializer.Deserialize<ProductCreateDto>(productDataValue.ToString());
                if (productDto == null) return BadRequest("Invalid productData");

                var files = form.Files;
                await productService.AddProductAsync(productDto, files);

                return StatusCode(201, new { success = true, message = "Product added successfully" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Add Product failed");
                return StatusCode(500, new { success = false, message = "Internal Server Error" });
            }
        }

        [HttpGet("list")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> ProductList()
        {
            var product = await productService.GetAllProductsAsync();
            return Ok(new { success = true, product });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> ProductById(Guid id)
        {
            var product = await productService.GetByIdAsync(id);
            if (product is null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPut("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeStock(Guid id, [FromQuery] bool inStock)
        {
            try
            {
                await productService.ChangeStockAsync(id, inStock);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "ChangeStock failed");
                return StatusCode(500, new { success = false, message = "Internal Server Error" });
            }
        }

    }
}
