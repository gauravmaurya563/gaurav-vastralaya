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
            
            // 0. Check if Settings table exists
            bool settingsTableExists = false;
            using (var cmd = conn.CreateCommand())
            {
                if (context.Database.IsSqlite())
                {
                    cmd.CommandText = "SELECT 1 FROM sqlite_master WHERE type='table' AND name='Settings';";
                }
                else
                {
                    cmd.CommandText = "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND LOWER(table_name) = 'settings';";
                }
                using (var reader = cmd.ExecuteReader())
                {
                    settingsTableExists = reader.Read();
                }
            }

            if (!settingsTableExists)
            {
                using (var cmd = conn.CreateCommand())
                {
                    if (context.Database.IsSqlite())
                    {
                        cmd.CommandText = @"
                            CREATE TABLE ""Settings"" (
                                ""Key"" TEXT NOT NULL PRIMARY KEY,
                                ""Value"" TEXT NOT NULL
                            );";
                    }
                    else
                    {
                        cmd.CommandText = @"
                            CREATE TABLE ""Settings"" (
                                ""Key"" VARCHAR(100) NOT NULL PRIMARY KEY,
                                ""Value"" TEXT NOT NULL
                            );";
                    }
                    cmd.ExecuteNonQuery();
                }
            }

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

            // 4. Check if SortOrder column exists in Products table
            bool sortOrderColumnExists = false;
            using (var cmd = conn.CreateCommand())
            {
                if (context.Database.IsSqlite())
                {
                    cmd.CommandText = "PRAGMA table_info(Products);";
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (reader.GetString(1).Equals("SortOrder", StringComparison.OrdinalIgnoreCase))
                            {
                                sortOrderColumnExists = true;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    cmd.CommandText = "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND LOWER(table_name) = 'products' AND LOWER(column_name) = 'sortorder';";
                    using (var reader = cmd.ExecuteReader())
                    {
                        sortOrderColumnExists = reader.Read();
                    }
                }
            }

            if (!sortOrderColumnExists)
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"ALTER TABLE ""Products"" ADD COLUMN ""SortOrder"" INTEGER DEFAULT 0 NOT NULL;";
                    cmd.ExecuteNonQuery();
                }
            }

            // 5. Ensure Sizes column in PostgreSQL is TEXT, not text[] (ARRAY)
            if (!context.Database.IsSqlite())
            {
                try
                {
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "SELECT data_type FROM information_schema.columns WHERE table_schema='public' AND LOWER(table_name)='products' AND LOWER(column_name)='sizes';";
                        var typeName = cmd.ExecuteScalar()?.ToString();
                        if (typeName != null && typeName.Equals("ARRAY", StringComparison.OrdinalIgnoreCase))
                        {
                            using (var alterCmd = conn.CreateCommand())
                            {
                                alterCmd.CommandText = @"ALTER TABLE ""Products"" ALTER COLUMN ""Sizes"" TYPE TEXT USING array_to_string(""Sizes"", ',');";
                                alterCmd.ExecuteNonQuery();
                            }
                        }
                    }
                }
                catch { /* Ignore or log */ }
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

            // Seed default settings
            if (!context.Settings.Any())
            {
                context.Settings.AddRange(new List<Setting>
                {
                    new Setting { Key = "WhatsAppNumber", Value = "919999999999" },
                    new Setting { Key = "InquiryTemplate", Value = "Hi Gaurav Vastralay, I am interested in this clothing item:\n\n*Product:* {ProductName}\n*Category:* {Category}\n*Fabric:* {Fabric}\n*Price Range:* {Price}\n*Selected Size/Length:* {Size}\n\nIs this available for ordering?" },
                    new Setting { Key = "RestockTemplate", Value = "Hi Gaurav Vastralay, I am interested in this design: *{ProductName}* which is currently out of stock. Could you let me know if/when this will be restocked or if I can pre-order it?" }
                });
                context.SaveChanges();
            }

            // Always clear the old database to ensure we get exactly our new items
            try
            {
                if (context.Database.IsSqlite())
                {
                    context.Database.ExecuteSqlRaw("DELETE FROM Products;");
                }
                else
                {
                    context.Database.ExecuteSqlRaw("DELETE FROM \"Products\";");
                }
            }
            catch
            {
                // Fallback in case table doesn't exist yet or query fails
                if (context.Products.Any()) {
                    context.Products.RemoveRange(context.Products);
                    context.SaveChanges();
                }
            }

            var products = new List<Product>
            {
                // === Category: Fabrics (10 Items) ===
                new Product
                {
                    Name = "Ajrakh Hand-Block Printed Cotton",
                    Description = "Soft breathable cotton fabric with traditional hand-block printed Ajrakh motifs. Perfect for custom kurtas, shirts, and everyday summer tailoring.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹349 - ₹899 / meter",
                    Fabric = "100% Giza Cotton",
                    Occasion = "Daily & Festive Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-1)
                },
                new Product
                {
                    Name = "Indigo Dabu Dyed Cambric Cotton",
                    Description = "Deep indigo cotton fabric made using the traditional Rajasthani mud-resist Dabu printing process. High quality, organic dyes, and skin-friendly.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹299 - ₹799 / meter",
                    Fabric = "Cambric Cotton",
                    Occasion = "Casual Day Outings",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-2)
                },
                new Product
                {
                    Name = "Handloom Banarasi Katan Silk Brocade",
                    Description = "Exquisite pure Katan silk fabric with intricate golden zari weaving. Luxurious look and feel, ideal for wedding blouses, jackets, and royal ensembles.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹1,899 - ₹4,500 / meter",
                    Fabric = "Pure Katan Silk",
                    Occasion = "Wedding & Bridal Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-3)
                },
                new Product
                {
                    Name = "Lucknowi Chikankari Viscose Georgette",
                    Description = "Beautiful flowing georgette material featuring traditional hand-embroidered Chikankari shadow work patterns. Perfect for dying in custom shades.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹899 - ₹2,499 / meter",
                    Fabric = "Viscose Georgette",
                    Occasion = "Festive Wear & Ceremonies",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-4)
                },
                new Product
                {
                    Name = "Kalamkari Natural Dye Cotton Fabric",
                    Description = "Organic cotton fabric printed with hand-drawn Kalamkari motifs using natural mineral and plant dyes. A masterpiece of traditional art.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹399 - ₹899 / meter",
                    Fabric = "Organic Cotton",
                    Occasion = "Traditional Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-5)
                },
                new Product
                {
                    Name = "Pure Irish Linen Solid Fabric",
                    Description = "Crisp, premium Irish linen in pastel shades. Highly breathable, durable, and sophisticated. Great for summer suits and shirts.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹599 - ₹1,299 / meter",
                    Fabric = "Pure Irish Linen",
                    Occasion = "Office & Smart Casual",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-6)
                },
                new Product
                {
                    Name = "French Lace Embroidered Net",
                    Description = "Imported net fabric with delicate French floral lace embroidery. Extravagant borders, perfect for overlay dresses, gowns, and wedding sarees.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹1,299 - ₹3,500 / meter",
                    Fabric = "Premium Nylon Net",
                    Occasion = "Evening Parties & Galas",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-7)
                },
                new Product
                {
                    Name = "Bandhani Tie & Dye Satin Georgette",
                    Description = "Vibrant multi-colored Bandhani tie-dye satin georgette. Smooth texture with distinct dot patterns, perfect for traditional styling.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹699 - ₹1,599 / meter",
                    Fabric = "Satin Georgette",
                    Occasion = "Festive Wear & Pooja",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-8)
                },
                new Product
                {
                    Name = "Golden Zari Woven Organza",
                    Description = "Ultra-lightweight organza fabric with woven metallic golden zari threads. Adds a elegant sheen and sophisticated volume to any outfit.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹499 - ₹1,499 / meter",
                    Fabric = "Premium Organza Silk",
                    Occasion = "Wedding & Festive Celebrations",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-9)
                },
                new Product
                {
                    Name = "Ikat Pochampally Handloom Cotton",
                    Description = "Authentic Pochampally handloom cotton fabric featuring double-ikat geometric patterns. Rich colors and comfortable weave.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/shirting_fabric.png",
                    PriceRange = "₹449 - ₹999 / meter",
                    Fabric = "Handloom Cotton",
                    Occasion = "Ethnic & Office Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/shirting_fabric.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-10)
                },

                // === Category: Sarees (10 Items) ===
                new Product
                {
                    Name = "Classic Banarasi Katan Silk Saree",
                    Description = "Royal Banarasi saree made of pure Katan silk with rich silver and golden zari work. Includes matching unstitched blouse piece.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹8,999 - ₹24,999",
                    Fabric = "Pure Katan Silk",
                    Occasion = "Wedding & Bridal Celebration",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-11)
                },
                new Product
                {
                    Name = "Hand-Painted Pen Kalamkari Saree",
                    Description = "Traditional cotton saree with hand-drawn Pen Kalamkari mythological tales painted using organic dyes. A unique heritage item.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹3,499 - ₹7,999",
                    Fabric = "Chenuri Cotton",
                    Occasion = "Cultural Events & Festivities",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-12)
                },
                new Product
                {
                    Name = "Royal Kanchipuram Brocade Saree",
                    Description = "South Indian masterpiece handwoven with pure mulberry silk and golden brocade thread borders. Reflects ultimate heritage elegance.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹12,999 - ₹35,000",
                    Fabric = "Mulberry Silk",
                    Occasion = "Bridal & Wedding Reception",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-13)
                },
                new Product
                {
                    Name = "Elegant Organza Floral Print Saree",
                    Description = "Light and airy organza saree featuring beautiful pastel floral prints and delicate hand-embroidered cutwork borders.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹1,899 - ₹4,500",
                    Fabric = "Soft Organza",
                    Occasion = "Party Wear & Receptions",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-14)
                },
                new Product
                {
                    Name = "Traditional Chanderi Zari Border Saree",
                    Description = "Sheer and glossy Chanderi silk cotton saree with signature small zari bootis and a rich gold-threaded pallu.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹2,999 - ₹6,499",
                    Fabric = "Chanderi Silk Cotton",
                    Occasion = "Festive Wear & Puja",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-15)
                },
                new Product
                {
                    Name = "Lucknowi Chikankari Georgette Saree",
                    Description = "A masterpiece of Chikankari and Kamdani work, hand-crafted on viscose georgette with beautiful jaal embroidery all over.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹4,999 - ₹11,999",
                    Fabric = "Viscose Georgette",
                    Occasion = "Formal Parties & Celebrations",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-16)
                },
                new Product
                {
                    Name = "Sambalpuri Handloom Ikat Saree",
                    Description = "Authentic handloom Sambalpuri saree with complex double-ikat weave patterns. Bold contrasts and traditional shell border motifs.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹3,899 - ₹8,500",
                    Fabric = "Pure Cotton",
                    Occasion = "Traditional Gatherings",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-17)
                },
                new Product
                {
                    Name = "Premium Mysore Crepe Silk Saree",
                    Description = "Luxurious, heavy crepe silk saree from Mysore with pure gold zari border. Soft fall, rich colors, and timeless look.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹7,499 - ₹15,999",
                    Fabric = "Pure Crepe Silk",
                    Occasion = "Ethnic Wear & Weddings",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-18)
                },
                new Product
                {
                    Name = "Modern Metallic Tissue Saree",
                    Description = "Shimmering tissue silk saree with a modern metallic gold finish. Simple yet highly dramatic, perfect for evening wear.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹2,499 - ₹5,999",
                    Fabric = "Tissue Silk",
                    Occasion = "Cocktail Parties & Dinners",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-19)
                },
                new Product
                {
                    Name = "Bandhej Gota Patti Border Saree",
                    Description = "traditional Rajasthani Bandhani saree decorated with heavy hand-crafted Gota Patti lace work on the border and pallu.",
                    Category = "Sarees",
                    ImageUrl = "/assets/cat_saree.png",
                    PriceRange = "₹3,200 - ₹7,500",
                    Fabric = "Georgette",
                    Occasion = "Festive Wear & Haldi",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/cat_saree.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-20)
                },

                // === Category: Suit Material (10 Items) ===
                new Product
                {
                    Name = "Unstitched Banarasi Silk Suit Set",
                    Description = "Luxury Banarasi silk dress material with matching woven dupatta. Design your custom salwar kameez or heavy anarkali set.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹2,499 - ₹5,999",
                    Fabric = "Banarasi Silk",
                    Occasion = "Festive Wear & Weddings",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-21)
                },
                new Product
                {
                    Name = "Jaipuri Cotton Hand-Block Suit Set",
                    Description = "Fine cotton printed suit material with matching mulmul dupatta. Light, highly breathable, and comfortable for summer wear.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹1,099 - ₹2,499",
                    Fabric = "Premium Cotton",
                    Occasion = "Daily Wear & Office",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-22)
                },
                new Product
                {
                    Name = "Heavy Embroidered Georgette Salwar Set",
                    Description = "Chic unstitched suit material in georgette with elaborate sequin and thread embroidery. Includes soft inner lining fabric.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹2,899 - ₹6,999",
                    Fabric = "Faux Georgette",
                    Occasion = "Party & Festive Wear",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-23)
                },
                new Product
                {
                    Name = "Handloom Linen Suit Material Set",
                    Description = "Premium handloom linen top and bottom material with a gorgeous linen-silk dupatta featuring zari stripe accents.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹1,899 - ₹4,200",
                    Fabric = "Handloom Linen",
                    Occasion = "Semi-Formal Events",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-24)
                },
                new Product
                {
                    Name = "Lucknowi Chikankari Viscose Material",
                    Description = "Elegant dyeable viscose suit material with intricate hand-embroidered Chikankari on front panel and matching chiffon dupatta.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹2,199 - ₹4,999",
                    Fabric = "Viscose Rayon",
                    Occasion = "Festive & Casual Outings",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-25)
                },
                new Product
                {
                    Name = "Velvet Zardozi Work Winter Suit Set",
                    Description = "Rich micro-velvet kurta material featuring premium heavy hand-crafted Zardozi embroidery on neckline and sleeves.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹3,999 - ₹9,500",
                    Fabric = "Premium Micro Velvet",
                    Occasion = "Winter Weddings & Dinners",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-26)
                },
                new Product
                {
                    Name = "Digital Printed Organza Dress Material",
                    Description = "Fresh watercolor-style floral prints on organza fabric. Includes solid color bottom material and a matching sheer dupatta.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹1,699 - ₹3,899",
                    Fabric = "Organza Silk",
                    Occasion = "Day Parties & Gatherings",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-27)
                },
                new Product
                {
                    Name = "Kani Woven Pashmina Suit Material",
                    Description = "Super warm and soft Pashmina unstitched suit material featuring beautiful Kani weave paisley design. Includes matching stole-dupatta.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹3,499 - ₹8,500",
                    Fabric = "Kashmiri Pashmina",
                    Occasion = "Festive Winter Outings",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-28)
                },
                new Product
                {
                    Name = "Designer Maheshwari Cotton Silk Set",
                    Description = "Maheshwari cotton silk unstitched dress material, featuring traditional borders and an elegant striped dupatta.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹2,299 - ₹5,200",
                    Fabric = "Maheshwari Cotton Silk",
                    Occasion = "Office & Formal Ethnic Wear",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-29)
                },
                new Product
                {
                    Name = "Tie-Dye Shibori Cotton Dress Material",
                    Description = "Unique Japanese style Shibori tie-dye patterns on pure soft cotton material. Highly modern look combined with comfort.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/cat_suit.png",
                    PriceRange = "₹1,199 - ₹2,599",
                    Fabric = "Pure Cotton",
                    Occasion = "Casual Day Wear",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/cat_suit.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-30)
                },

                // === Category: Kurtas (10 Items) ===
                new Product
                {
                    Name = "Embroidered Chanderi Kurta Set",
                    Description = "Readymade straight fit Chanderi silk kurta with delicate golden thread embroidery. Includes matching pants and dupatta.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹1,899 - ₹4,299",
                    Fabric = "Chanderi Silk Blend",
                    Occasion = "Festive Wear & Puja",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-31)
                },
                new Product
                {
                    Name = "Hand-Block Printed Cotton A-Line Kurta",
                    Description = "A-line flared cotton kurta featuring beautiful hand-block Sanganeri prints. Comfortable flared fitting, perfect for daily casual wear.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹999 - ₹2,199",
                    Fabric = "Premium Cotton",
                    Occasion = "Daily Wear & Office",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-32)
                },
                new Product
                {
                    Name = "Classic Chikankari Georgette Kurta",
                    Description = " Lucknowi Chikankari embroidered georgette kurta with matching inner slip. Exquisitely handcrafted, floral motifs.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹1,499 - ₹3,499",
                    Fabric = "Viscose Georgette",
                    Occasion = "Festivals & Luncheons",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-33)
                },
                new Product
                {
                    Name = "Premium Rayon Front-Slit Kurta",
                    Description = "Modern front-slit straight kurta with elegant print pattern. Soft fabric, regular fit, comfortable for all-day wear.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹899 - ₹1,899",
                    Fabric = "Premium Rayon",
                    Occasion = "Casual Gatherings",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-34)
                },
                new Product
                {
                    Name = "Angrakha Style Festive Kurta Set",
                    Description = "Traditional side-tie Angrakha style kurta set in vibrant colors. Trimmed with gorgeous gold gota borders and tassels.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹2,299 - ₹5,499",
                    Fabric = "Cotton Silk",
                    Occasion = "Festive Wear & Haldi",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-35)
                },
                new Product
                {
                    Name = "Solid Linen Kurti with Lace Details",
                    Description = "Minimalistic solid pastel linen kurti featuring delicate white cotton lace details on sleeves and hemline. Smart look.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹1,199 - ₹2,599",
                    Fabric = "Pure Linen",
                    Occasion = "Office Wear & Travel",
                    Sizes = new() { "S", "M", "L", "XL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-36)
                },
                new Product
                {
                    Name = "Bandhani Print Anarkali Kurta Set",
                    Description = "Floor-length flared Anarkali kurta in classic Bandhani print design. High-volume flair with a matching solid dupatta.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹1,699 - ₹3,999",
                    Fabric = "Soft Crepe",
                    Occasion = "Sangeet & Puja Nights",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-37)
                },
                new Product
                {
                    Name = "Silk Blend Straight Kurta Set",
                    Description = "Elegant straight fit silk blend kurta with contrast embroidery on neck, paired with trousers and an organza dupatta.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹2,499 - ₹5,999",
                    Fabric = "Silk Cotton Blend",
                    Occasion = "Family Gatherings",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-38)
                },
                new Product
                {
                    Name = "Floral Printed Cotton Kaftan Kurta",
                    Description = "Relaxed-fit Kaftan style cotton kurta with drawstring waist. Chic, easy-breezy design for casual summer days.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹799 - ₹1,699",
                    Fabric = "Cambric Cotton",
                    Occasion = "Lounge & Casual Wear",
                    Sizes = new() { "Free size", "S to XXL adjustable" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-39)
                },
                new Product
                {
                    Name = "Velvet Kurta with Banarasi Dupatta",
                    Description = "Super soft royal velvet straight kurta in jewel tones, paired with a rich matching Banarasi silk woven dupatta.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/readymade_kurta.png",
                    PriceRange = "₹3,299 - ₹7,999",
                    Fabric = "Soft Micro Velvet",
                    Occasion = "Evening Celebrations & Puja",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/readymade_kurta.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-40)
                },

                // === Category: Mens (10 Items) ===
                new Product
                {
                    Name = "Handloom Khadi Cotton Short Kurta",
                    Description = "Classic men's short length kurta made of hand-spun Khadi cotton. Ideal pairing with jeans for a modern ethnic look.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹699 - ₹1,499",
                    Fabric = "Handloom Khadi",
                    Occasion = "Casual Wear",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-41)
                },
                new Product
                {
                    Name = "Classic Linen Formal Shirt Fabric",
                    Description = "Pure Irish linen unstitched shirt piece. Choose custom tailoring for a premium and breathable corporate look.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹899 - ₹1,999",
                    Fabric = "Pure Irish Linen",
                    Occasion = "Office & Business Casual",
                    Sizes = new() { "1.6 meter shirt cut", "2 meter custom cut" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-42)
                },
                new Product
                {
                    Name = "Banarasi Brocade Sherwani Fabric",
                    Description = "Extravagant Banarasi silk brocade fabric for designer men's sherwanis, wedding jackets, or royal bandhgalas.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹2,499 - ₹6,500 / meter",
                    Fabric = "Art Silk Brocade",
                    Occasion = "Wedding & Groomswear",
                    Sizes = new() { "1 meter", "3 meters Sherwani cut", "Custom cut" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-43)
                },
                new Product
                {
                    Name = "Indigo Printed Mens Cotton Shirt",
                    Description = "Regular fit casual shirt printed with organic indigo dabu patterns. Smart style for semi-formal summer gatherings.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹999 - ₹1,999",
                    Fabric = "Cotton Cambric",
                    Occasion = "Weekend Outings & Travel",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-44)
                },
                new Product
                {
                    Name = "Festive Silk Blend Kurta Pyjama Set",
                    Description = "Men's traditional ethnic set featuring a silk-blend straight kurta with elegant neck embroidery and solid pyjama pants.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹1,799 - ₹3,999",
                    Fabric = "Silk Cotton Blend",
                    Occasion = "Festive Celebrations & Wedding Guests",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-45)
                },
                new Product
                {
                    Name = "Premium Giza Cotton Mens Shirt",
                    Description = "Super soft, luxury long-staple Giza cotton shirt. Breathable, durable weave, perfect for boardrooms or evening events.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹1,299 - ₹2,799",
                    Fabric = "100% Giza Cotton",
                    Occasion = "Business Formal & Dinner",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-46)
                },
                new Product
                {
                    Name = "Casual Bandhani Printed Mens Kurta",
                    Description = "Light cotton kurta printed in beautiful tie-dye Bandhej style. Classic festive and traditional design.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹899 - ₹1,799",
                    Fabric = "Pure Cotton",
                    Occasion = "Festivals & Mehendi",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-47)
                },
                new Product
                {
                    Name = "Traditional Woven Nehru Jacket",
                    Description = "Smart tailored Nehru jacket featuring a hand-woven texture. Layer it over solid kurtas for a refined ethnic appearance.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹1,499 - ₹3,499",
                    Fabric = "Jute Silk",
                    Occasion = "Engagement & Festival Layering",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-48)
                },
                new Product
                {
                    Name = "Modern Ikat Patterned Mens Shirt",
                    Description = "Full sleeves casual shirt in authentic handloom Ikat weave. Distinct geometric shapes, very artistic design.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹1,099 - ₹2,299",
                    Fabric = "Handloom Cotton",
                    Occasion = "Creative Meetings & Travel",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-49)
                },
                new Product
                {
                    Name = "Handwoven Tussar Silk Mens Kurta",
                    Description = "Luxurious pure Tussar silk kurta in natural beige shade. Rich textured finish, highlighting premium traditional style.",
                    Category = "Mens",
                    ImageUrl = "/assets/cat_shirt.png",
                    PriceRange = "₹2,199 - ₹4,800",
                    Fabric = "Pure Tussar Silk",
                    Occasion = "Festive Puja & Traditional Ceremonies",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/cat_shirt.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-50)
                },

                // === Category: Combos (10 Items) ===
                new Product
                {
                    Name = "Mother-Daughter Matching Saree & Lehenga Set",
                    Description = "Beautiful coordinated set featuring matching georgette saree for mother and small lehenga-choli for daughter.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹4,999 - ₹12,999",
                    Fabric = "Soft Georgette",
                    Occasion = "Family Weddings & Receptions",
                    Sizes = new() { "Standard Saree", "Custom kids sizes" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-51)
                },
                new Product
                {
                    Name = "Kurta & Jacket Wedding Family Combo",
                    Description = "Complete family combo set including matching Nehru jacket and kurta sets for father, son, and matching suit set for mother.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹3,499 - ₹8,999",
                    Fabric = "Silk Cotton Blend",
                    Occasion = "Family Festive Events",
                    Sizes = new() { "Coordinated Family Set" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-52)
                },
                new Product
                {
                    Name = "Hand-Block Printed Bedding & Curtain Set",
                    Description = "Premium home combo featuring double size bedsheet, pillow covers, and matching cotton window curtains in Rajasthani print.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹2,299 - ₹5,500",
                    Fabric = "100% Cotton",
                    Occasion = "Home Decor & Gifting",
                    Sizes = new() { "Double Bedsheet + 2 Curtains" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-53)
                },
                new Product
                {
                    Name = "Premium Fabric & Matching Dupatta Combo",
                    Description = "Coordinated dress fabric piece with an exquisitely designed printed dupatta. Take it to your tailor for a unique custom suit.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹1,299 - ₹3,299",
                    Fabric = "Cotton Top + Silk Dupatta",
                    Occasion = "Ethnic Wear Gifting",
                    Sizes = new() { "2.5m Fabric + 2.25m Dupatta" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-54)
                },
                new Product
                {
                    Name = "Festive Gifting Kurta & Dhoti Set",
                    Description = "Traditional silk-blend kurta paired with matching pre-stitched dhoti pants. Includes sweet festive packaging, great for gifting.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹1,999 - ₹4,500",
                    Fabric = "Art Silk Blend",
                    Occasion = "Diwali, Puja & Gifting",
                    Sizes = new() { "M", "L", "XL" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-55)
                },
                new Product
                {
                    Name = "Bride & Groom Matching Haldi Outfits",
                    Description = "Matching yellow ensemble: flared coordinates for the bride and matching styled kurta-pyjama for the groom.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹5,999 - ₹14,999",
                    Fabric = "Organic Cotton Silk",
                    Occasion = "Haldi & Pre-Wedding Ceremony",
                    Sizes = new() { "Matching Couple Set" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-56)
                },
                new Product
                {
                    Name = "Coordinated Shirt & Kurta Couple Combo",
                    Description = "Matching couple coordinates featuring premium linen shirts for men and coordinated long linen straight kurtis for women.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹2,499 - ₹5,800",
                    Fabric = "Pure Handloom Linen",
                    Occasion = "Anniversaries & Couple Travel",
                    Sizes = new() { "Mens M to XXL", "Womens S to XL" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-57)
                },
                new Product
                {
                    Name = "Ethnic Brocade Potli Bag & Dupatta Set",
                    Description = "Stunning traditional accessory combo featuring a woven Banarasi silk dupatta and matching drawstring potli bag.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹999 - ₹2,499",
                    Fabric = "Banarasi Brocade",
                    Occasion = "Weddings & Sangeet",
                    Sizes = new() { "Free size set" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-58)
                },
                new Product
                {
                    Name = "Festive Handloom Saree & Stole Combo",
                    Description = "Gift set comprising of a premium handloom Tussar silk saree and matching silk stole. Perfect formal or wedding season corporate gift.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹3,899 - ₹8,500",
                    Fabric = "Tussar Silk",
                    Occasion = "Corporate Gifting & Festivals",
                    Sizes = new() { "Free size set" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-59)
                },
                new Product
                {
                    Name = "Unstitched Suit & Silk Dupatta Gift Set",
                    Description = "Luxury unstitched crepe silk suit material paired with a rich woven Banarasi silk dupatta, packed in a handmade designer box.",
                    Category = "Combos",
                    ImageUrl = "/assets/cat_combo.png",
                    PriceRange = "₹1,699 - ₹3,999",
                    Fabric = "Crepe Silk & Banarasi Silk",
                    Occasion = "Rakhi & Wedding Gifting",
                    Sizes = new() { "Unstitched Dress Material Set" },
                    Images = new() { "/assets/cat_combo.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-60)
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
