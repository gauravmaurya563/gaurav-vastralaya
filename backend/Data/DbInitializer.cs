using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;
using backend.Services;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // Seed default admin user
            if (!context.AdminUsers.Any())
            {
                context.AdminUsers.Add(new AdminUser
                {
                    Username = "admin",
                    PasswordHash = PasswordHelper.HashPassword("AdminPassword123!"),
                    CreatedAt = DateTime.UtcNow
                });
                context.SaveChanges();
            }

            // Always clear the old database to ensure we get exactly our 50 new items
            if (context.Products.Any()) {
                context.Products.RemoveRange(context.Products);
                context.SaveChanges();
            }

            var products = new List<Product>();
                var random = new Random();
                
                string[] categories = { "Saree", "T-Shirt", "Shirt", "Suit", "Jeans", "Combo" };
                var imageMap = new Dictionary<string, string>
                {
                    { "Saree", "/assets/cat_saree.png" },
                    { "T-Shirt", "/assets/cat_tshirt.png" },
                    { "Shirt", "/assets/cat_shirt.png" },
                    { "Suit", "/assets/cat_suit.png" },
                    { "Jeans", "/assets/cat_jeans.png" },
                    { "Combo", "/assets/cat_combo.png" }
                };

                string[] adjectives = { "Premium", "Luxury", "Elegant", "Designer", "Classic", "Modern", "Handwoven", "Bespoke" };
                
                for (int i = 1; i <= 50; i++)
                {
                    string category = categories[random.Next(categories.Length)];
                    string adjective = adjectives[random.Next(adjectives.Length)];
                    
                    // Use a unique placeholder image from loremflickr using the category as a keyword
                    // The 'lock' parameter ensures the URL is unique and stable per product ID
                    string searchTerm = category.ToLower().Replace("combo", "fabric").Replace("t-shirt", "tshirt");
                    string imageUrl = $"https://loremflickr.com/400/600/fashion,{searchTerm}?lock={i}";
                    
                    int priceBase = random.Next(10, 150) * 100;
                    
                    products.Add(new Product
                    {
                        Name = $"{adjective} {category} {i}",
                        Description = $"A beautiful {adjective.ToLower()} {category.ToLower()} crafted for ultimate comfort and style. Perfect for any occasion.",
                        Category = category,
                        ImageUrl = imageUrl,
                        PriceRange = $"₹{priceBase:N0} - ₹{(priceBase + random.Next(10, 50)*100):N0}",
                        Fabric = "Premium Blend",
                        Occasion = "All Occasions",
                        Sizes = new() { "S", "M", "L", "XL" },
                        Images = new() { imageUrl },
                        CreatedAt = DateTime.UtcNow.AddDays(-i)
                    });
                }

                context.Products.AddRange(products);
                context.SaveChanges();
        }
    }
}
