using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageUploadService _imageUploadService;

        public AdminProductsController(AppDbContext context, IImageUploadService imageUploadService)
        {
            _context = context;
            _imageUploadService = imageUploadService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductUploadDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Category))
                {
                    return BadRequest(new { message = "Product Name and Category are required." });
                }

                var imageUrls = new List<string>();

                if (dto.Files != null && dto.Files.Count > 0)
                {
                    foreach (var file in dto.Files)
                    {
                        if (file.Length > 0)
                        {
                            var secureUrl = await _imageUploadService.UploadImageAsync(file);
                            imageUrls.Add(secureUrl);
                        }
                    }
                }

                // Sizes processing (comma-separated, default to standard list if empty)
                var sizesList = new List<string>();
                if (!string.IsNullOrWhiteSpace(dto.Sizes))
                {
                    sizesList = dto.Sizes.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                         .Select(s => s.Trim())
                                         .ToList();
                }
                else
                {
                    sizesList = new List<string> { "S", "M", "L", "XL" };
                }

                var product = new Product
                {
                    Name = dto.Name,
                    Description = dto.Description ?? string.Empty,
                    Category = dto.Category,
                    Fabric = dto.Fabric ?? "Premium Blend",
                    Occasion = dto.Occasion ?? "All Occasions",
                    PriceRange = dto.PriceRange ?? "Contact for price",
                    Sizes = sizesList,
                    Images = imageUrls,
                    // ImageUrl is the first image or a placeholder
                    ImageUrl = imageUrls.FirstOrDefault() ?? "https://loremflickr.com/400/600/fashion",
                    IsSoldOut = dto.IsSoldOut,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                
                return StatusCode(201, product);
            }
            catch (Exception ex)
            {
                var fullErrorMessage = ex.Message;
                var inner = ex.InnerException;
                while (inner != null)
                {
                    fullErrorMessage += " --> " + inner.Message;
                    inner = inner.InnerException;
                }
                return StatusCode(500, new { message = "An error occurred during product creation.", error = fullErrorMessage, stack = ex.StackTrace });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                // Delete associated uploaded files using image upload service
                foreach (var imgUrl in product.Images)
                {
                    await _imageUploadService.DeleteImageAsync(imgUrl);
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Product permanently deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during product deletion.", error = ex.Message });
            }
        }
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUploadDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Category))
                {
                    return BadRequest(new { message = "Product Name and Category are required." });
                }

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                product.Name = dto.Name;
                product.Description = dto.Description ?? string.Empty;
                product.Category = dto.Category;
                product.Fabric = dto.Fabric ?? "Premium Blend";
                product.Occasion = dto.Occasion ?? "All Occasions";
                product.PriceRange = dto.PriceRange ?? "Contact for price";
                product.IsSoldOut = dto.IsSoldOut;

                // Sizes processing
                if (!string.IsNullOrWhiteSpace(dto.Sizes))
                {
                    product.Sizes = dto.Sizes.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                             .Select(s => s.Trim())
                                             .ToList();
                }

                // If new files are uploaded, replace the old ones
                if (dto.Files != null && dto.Files.Count > 0)
                {
                    // Delete old images
                    foreach (var imgUrl in product.Images)
                    {
                        await _imageUploadService.DeleteImageAsync(imgUrl);
                    }

                    var newImageUrls = new List<string>();
                    foreach (var file in dto.Files)
                    {
                        if (file.Length > 0)
                        {
                            var secureUrl = await _imageUploadService.UploadImageAsync(file);
                            newImageUrls.Add(secureUrl);
                        }
                    }

                    product.Images = newImageUrls;
                    product.ImageUrl = newImageUrls.FirstOrDefault() ?? "https://loremflickr.com/400/600/fashion";
                }

                await _context.SaveChangesAsync();

                return Ok(product);
            }
            catch (Exception ex)
            {
                var fullErrorMessage = ex.Message;
                var inner = ex.InnerException;
                while (inner != null)
                {
                    fullErrorMessage += " --> " + inner.Message;
                    inner = inner.InnerException;
                }
                return StatusCode(500, new { message = "An error occurred during product update.", error = fullErrorMessage });
            }
        }

        [HttpPut("{id}/sort-order")]
        public async Task<IActionResult> UpdateSortOrder(int id, [FromBody] SortOrderDto dto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Product with ID {id} not found." });
                }

                product.SortOrder = dto.SortOrder;
                await _context.SaveChangesAsync();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during sort order update.", error = ex.Message });
            }
        }
    }

    public class SortOrderDto
    {
        public int SortOrder { get; set; }
    }

    public class ProductUploadDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? PriceRange { get; set; }
        public string? Fabric { get; set; }
        public string? Occasion { get; set; }
        public string? Sizes { get; set; } // Comma-separated sizes e.g., "S,M,L,XL"
        public bool IsSoldOut { get; set; } = false;
        public List<IFormFile> Files { get; set; } = new();
    }
}
