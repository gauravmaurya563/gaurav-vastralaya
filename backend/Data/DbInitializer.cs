using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void EnsureSchemaUpToDate(AppDbContext context)
        {
            context.Database.OpenConnection();
            var conn = context.Database.GetDbConnection();
            
            // 1. Check if AdminUsers table exists
            bool adminUsersTableExists = false;
            using (var cmd = conn.CreateCommand())
            {
                if (context.Database.IsSqlite())
                {
                    cmd.CommandText = "SELECT 1 FROM sqlite_master WHERE type='table' AND name='AdminUsers';";
                }
                else
                {
                    cmd.CommandText = "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND LOWER(table_name) = 'adminusers';";
                }
                using (var reader = cmd.ExecuteReader())
                {
                    adminUsersTableExists = reader.Read();
                }
            }

            if (!adminUsersTableExists)
            {
                using (var cmd = conn.CreateCommand())
                {
                    if (context.Database.IsSqlite())
                    {
                        cmd.CommandText = @"
                            CREATE TABLE ""AdminUsers"" (
                                ""Id"" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                ""Username"" TEXT NOT NULL,
                                ""PasswordHash"" TEXT NOT NULL,
                                ""CreatedAt"" TEXT NOT NULL
                            );";
                    }
                    else
                    {
                        cmd.CommandText = @"
                            CREATE TABLE ""AdminUsers"" (
                                ""Id"" SERIAL PRIMARY KEY,
                                ""Username"" VARCHAR(50) NOT NULL,
                                ""PasswordHash"" VARCHAR(255) NOT NULL,
                                ""CreatedAt"" TIMESTAMP WITH TIME ZONE NOT NULL
                            );";
                    }
                    cmd.ExecuteNonQuery();
                }
            }

            // 2. Check if Images column exists in Products table
            bool imagesColumnExists = false;
            using (var cmd = conn.CreateCommand())
            {
                if (context.Database.IsSqlite())
                {
                    cmd.CommandText = "PRAGMA table_info(Products);";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (reader.GetString(1).Equals("Images", StringComparison.OrdinalIgnoreCase))
                            {
                                imagesColumnExists = true;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    cmd.CommandText = "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND LOWER(table_name) = 'products' AND LOWER(column_name) = 'images';";
                    using (var reader = cmd.ExecuteReader())
                    {
                        imagesColumnExists = reader.Read();
                    }
                }
            }

            if (!imagesColumnExists)
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"ALTER TABLE ""Products"" ADD COLUMN ""Images"" TEXT NULL;";
                    cmd.ExecuteNonQuery();
                }
            }

            // 3. Check if CreatedAt column exists in Products table
            bool createdAtColumnExists = false;
            using (var cmd = conn.CreateCommand())
            {
                if (context.Database.IsSqlite())
                {
                    cmd.CommandText = "PRAGMA table_info(Products);";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (reader.GetString(1).Equals("CreatedAt", StringComparison.OrdinalIgnoreCase))
                            {
                                createdAtColumnExists = true;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    cmd.CommandText = "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND LOWER(table_name) = 'products' AND LOWER(column_name) = 'createdat';";
                    using (var reader = cmd.ExecuteReader())
                    {
                        createdAtColumnExists = reader.Read();
                    }
                }
            }

            if (!createdAtColumnExists)
            {
                using (var cmd = conn.CreateCommand())
                {
                    if (context.Database.IsSqlite())
                    {
                        cmd.CommandText = @"ALTER TABLE ""Products"" ADD COLUMN ""CreatedAt"" TEXT NULL;";
                    }
                    else
                    {
                        cmd.CommandText = @"ALTER TABLE ""Products"" ADD COLUMN ""CreatedAt"" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;";
                    }
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public static void Seed(AppDbContext context)
        {
            // First run dynamic schema checks/updates to keep live database aligned
            EnsureSchemaUpToDate(context);

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
