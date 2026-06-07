using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // Seed 50 products for e-commerce showcase
            if (context.Products.Count() < 20)
            {
                // Optionally clear old ones to prevent duplicates if count was < 20 but > 0
                if (context.Products.Any()) {
                    context.Products.RemoveRange(context.Products);
                    context.SaveChanges();
                }

                var products = new List<Product>();
                var random = new Random();
                
                string[] categories = { "Saree", "Suit", "Shirting", "Ready-made" };
                string[] adjectives = { "Premium", "Luxury", "Elegant", "Designer", "Classic", "Modern", "Handwoven", "Bespoke" };
                string[] fabrics = { "Pure Silk", "Georgette", "Cotton Blend", "Velvet", "Chiffon", "Organza", "Linen" };
                
                for (int i = 1; i <= 50; i++)
                {
                    string category = categories[random.Next(categories.Length)];
                    string adjective = adjectives[random.Next(adjectives.Length)];
                    string fabric = fabrics[random.Next(fabrics.Length)];
                    
                    int priceBase = random.Next(10, 150) * 100;
                    
                    products.Add(new Product
                    {
                        Name = $"{adjective} {category} {i}",
                        Description = $"A beautiful {adjective.ToLower()} {category.ToLower()} crafted from {fabric.ToLower()}. Perfect for all occasions with intricate detailing.",
                        Category = category,
                        ImageUrl = $"https://picsum.photos/seed/vastralaya{i}/400/500", // Unique image for each product
                        PriceRange = $"₹{priceBase:N0} - ₹{(priceBase + random.Next(10, 50)*100):N0}",
                        Fabric = fabric,
                        Occasion = "Festive / Wear",
                        Sizes = new() { "S", "M", "L", "Free Size" }
                    });
                }

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}
