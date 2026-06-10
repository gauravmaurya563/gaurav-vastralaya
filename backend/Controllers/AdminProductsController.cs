using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
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

        public AdminProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductUploadDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Category))
            {
                return BadRequest(new { message = "Product Name and Category are required." });
            }

            // Verify uploads folder exists
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var imageUrls = new List<string>();

            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    if (file.Length > 0)
                    {
                        // Generate unique file name
                        var extension = Path.GetExtension(file.FileName);
                        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
                        var filePath = Path.Combine(uploadsPath, uniqueFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        // Save the relative URL path
                        imageUrls.Add($"/uploads/{uniqueFileName}");
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
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetProduct", "Products", new { id = product.Id }, product);
        }
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
        public List<IFormFile> Files { get; set; } = new();
    }
}
