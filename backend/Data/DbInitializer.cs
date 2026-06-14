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
                    new Setting { Key = "RestockTemplate", Value = "Hi Gaurav Vastralay, I am interested in this design: *{ProductName}* which is currently out of stock. Could you let me know if/when this will be restocked or if I can pre-order it?" },
                    new Setting { Key = "InstagramUrl", Value = "https://instagram.com/gaurav_vastralay" },
                    new Setting { Key = "FacebookUrl", Value = "https://facebook.com/gaurav_vastralay" }
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
                // === Category: Fabrics (4 Items) ===
                new Product
                {
                    Name = "Ajrakh Hand-Block Printed Cotton",
                    Description = "Soft breathable cotton fabric with traditional hand-block printed Ajrakh motifs. Perfect for custom kurtas, shirts, and everyday summer tailoring.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/fabric_1.png",
                    PriceRange = "₹349 - ₹899 / meter",
                    Fabric = "100% Giza Cotton",
                    Occasion = "Daily & Festive Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/fabric_1.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-1)
                },
                new Product
                {
                    Name = "Indigo Dabu Dyed Cambric Cotton",
                    Description = "Deep indigo cotton fabric made using the traditional Rajasthani mud-resist Dabu printing process. High quality, organic dyes, and skin-friendly.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/fabric_2.png",
                    PriceRange = "₹299 - ₹799 / meter",
                    Fabric = "Cambric Cotton",
                    Occasion = "Casual Day Outings",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/fabric_2.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-2)
                },
                new Product
                {
                    Name = "Handloom Banarasi Katan Silk Brocade",
                    Description = "Exquisite pure Katan silk fabric with intricate golden zari weaving. Luxurious look and feel, ideal for wedding blouses, jackets, and royal ensembles.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/fabric_3.png",
                    PriceRange = "₹1,899 - ₹4,500 / meter",
                    Fabric = "Pure Katan Silk",
                    Occasion = "Wedding & Bridal Wear",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/fabric_3.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-3)
                },
                new Product
                {
                    Name = "Lucknowi Chikankari Viscose Georgette",
                    Description = "Beautiful flowing georgette material featuring traditional hand-embroidered Chikankari shadow work patterns. Perfect for dying in custom shades.",
                    Category = "Fabrics",
                    ImageUrl = "/assets/fabric_4.png",
                    PriceRange = "₹899 - ₹2,499 / meter",
                    Fabric = "Viscose Georgette",
                    Occasion = "Festive Wear & Ceremonies",
                    Sizes = new() { "1 meter", "2.5 meters", "Custom cut" },
                    Images = new() { "/assets/fabric_4.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-4)
                },

                // === Category: Sarees (4 Items) ===
                new Product
                {
                    Name = "Classic Banarasi Katan Silk Saree",
                    Description = "Royal Banarasi saree made of pure Katan silk with rich silver and golden zari work. Includes matching unstitched blouse piece.",
                    Category = "Sarees",
                    ImageUrl = "/assets/saree_1_banarasi_red.png",
                    PriceRange = "₹8,999 - ₹24,999",
                    Fabric = "Pure Katan Silk",
                    Occasion = "Wedding & Bridal Celebration",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/saree_1_banarasi_red.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-11)
                },
                new Product
                {
                    Name = "Hand-Painted Pen Kalamkari Saree",
                    Description = "Traditional cotton saree with hand-drawn Pen Kalamkari mythological tales painted using organic dyes. A unique heritage item.",
                    Category = "Sarees",
                    ImageUrl = "/assets/saree_2_kanjeevaram_blue.png",
                    PriceRange = "₹3,499 - ₹7,999",
                    Fabric = "Chenuri Cotton",
                    Occasion = "Cultural Events & Festivities",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/saree_2_kanjeevaram_blue.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-12)
                },
                new Product
                {
                    Name = "Royal Kanchipuram Brocade Saree",
                    Description = "South Indian masterpiece handwoven with pure mulberry silk and golden brocade thread borders. Reflects ultimate heritage elegance.",
                    Category = "Sarees",
                    ImageUrl = "/assets/saree_3_chiffon_pink.png",
                    PriceRange = "₹12,999 - ₹35,000",
                    Fabric = "Mulberry Silk",
                    Occasion = "Bridal & Wedding Reception",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/saree_3_chiffon_pink.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-13)
                },
                new Product
                {
                    Name = "Elegant Organza Floral Print Saree",
                    Description = "Light and airy organza saree featuring beautiful pastel floral prints and delicate hand-embroidered cutwork borders.",
                    Category = "Sarees",
                    ImageUrl = "/assets/saree_4_paithani_green.png",
                    PriceRange = "₹1,899 - ₹4,500",
                    Fabric = "Soft Organza",
                    Occasion = "Party Wear & Receptions",
                    Sizes = new() { "Free size", "Blouse piece included" },
                    Images = new() { "/assets/saree_4_paithani_green.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-14)
                },

                // === Category: Suit Material (4 Items) ===
                new Product
                {
                    Name = "Unstitched Banarasi Silk Suit Set",
                    Description = "Luxury Banarasi silk dress material with matching woven dupatta. Design your custom salwar kameez or heavy anarkali set.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/suit_1.png",
                    PriceRange = "₹2,499 - ₹5,999",
                    Fabric = "Banarasi Silk",
                    Occasion = "Festive Wear & Weddings",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/suit_1.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-21)
                },
                new Product
                {
                    Name = "Jaipuri Cotton Hand-Block Suit Set",
                    Description = "Fine cotton printed suit material with matching mulmul dupatta. Light, highly breathable, and comfortable for summer wear.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/suit_2.png",
                    PriceRange = "₹1,099 - ₹2,499",
                    Fabric = "Premium Cotton",
                    Occasion = "Daily Wear & Office",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/suit_2.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-22)
                },
                new Product
                {
                    Name = "Heavy Embroidered Georgette Salwar Set",
                    Description = "Chic unstitched suit material in georgette with elaborate sequin and thread embroidery. Includes soft inner lining fabric.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/suit_3.png",
                    PriceRange = "₹2,899 - ₹6,999",
                    Fabric = "Faux Georgette",
                    Occasion = "Party & Festive Wear",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/suit_3.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-23)
                },
                new Product
                {
                    Name = "Handloom Linen Suit Material Set",
                    Description = "Premium handloom linen top and bottom material with a gorgeous linen-silk dupatta featuring zari stripe accents.",
                    Category = "Suit Material",
                    ImageUrl = "/assets/suit_4.png",
                    PriceRange = "₹1,899 - ₹4,200",
                    Fabric = "Handloom Linen",
                    Occasion = "Semi-Formal Events",
                    Sizes = new() { "Unstitched Set" },
                    Images = new() { "/assets/suit_4.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-24)
                },

                // === Category: Kurtas (4 Items) ===
                new Product
                {
                    Name = "Embroidered Chanderi Kurta Set",
                    Description = "Readymade straight fit Chanderi silk kurta with delicate golden thread embroidery. Includes matching pants and dupatta.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/kurta_1.png",
                    PriceRange = "₹1,899 - ₹4,299",
                    Fabric = "Chanderi Silk Blend",
                    Occasion = "Festive Wear & Puja",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/kurta_1.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-31)
                },
                new Product
                {
                    Name = "Hand-Block Printed Cotton A-Line Kurta",
                    Description = "A-line flared cotton kurta featuring beautiful hand-block Sanganeri prints. Comfortable flared fitting, perfect for daily casual wear.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/kurta_2.png",
                    PriceRange = "₹999 - ₹2,199",
                    Fabric = "Premium Cotton",
                    Occasion = "Daily Wear & Office",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/kurta_2.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-32)
                },
                new Product
                {
                    Name = "Classic Chikankari Georgette Kurta",
                    Description = " Lucknowi Chikankari embroidered georgette kurta with matching inner slip. Exquisitely handcrafted, floral motifs.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/kurta_3.png",
                    PriceRange = "₹1,499 - ₹3,499",
                    Fabric = "Viscose Georgette",
                    Occasion = "Festivals & Luncheons",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/kurta_3.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-33)
                },
                new Product
                {
                    Name = "Premium Rayon Front-Slit Kurta",
                    Description = "Modern front-slit straight kurta with elegant print pattern. Soft fabric, regular fit, comfortable for all-day wear.",
                    Category = "Kurtas",
                    ImageUrl = "/assets/kurta_4.png",
                    PriceRange = "₹899 - ₹1,899",
                    Fabric = "Premium Rayon",
                    Occasion = "Casual Gatherings",
                    Sizes = new() { "S", "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/kurta_4.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-34)
                },

                // === Category: Mens (4 Items) ===
                new Product
                {
                    Name = "Handloom Khadi Cotton Short Kurta",
                    Description = "Classic men's short length kurta made of hand-spun Khadi cotton. Ideal pairing with jeans for a modern ethnic look.",
                    Category = "Mens",
                    ImageUrl = "/assets/mens_1.png",
                    PriceRange = "₹699 - ₹1,499",
                    Fabric = "Handloom Khadi",
                    Occasion = "Casual Wear",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/mens_1.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-41)
                },
                new Product
                {
                    Name = "Classic Linen Formal Shirt Fabric",
                    Description = "Pure Irish linen unstitched shirt piece. Choose custom tailoring for a premium and breathable corporate look.",
                    Category = "Mens",
                    ImageUrl = "/assets/mens_2.png",
                    PriceRange = "₹899 - ₹1,999",
                    Fabric = "Pure Irish Linen",
                    Occasion = "Office & Business Casual",
                    Sizes = new() { "1.6 meter shirt cut", "2 meter custom cut" },
                    Images = new() { "/assets/mens_2.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-42)
                },
                new Product
                {
                    Name = "Banarasi Brocade Sherwani Fabric",
                    Description = "Extravagant Banarasi silk brocade fabric for designer men's sherwanis, wedding jackets, or royal bandhgalas.",
                    Category = "Mens",
                    ImageUrl = "/assets/mens_3.png",
                    PriceRange = "₹2,499 - ₹6,500 / meter",
                    Fabric = "Art Silk Brocade",
                    Occasion = "Wedding & Groomswear",
                    Sizes = new() { "1 meter", "3 meters Sherwani cut", "Custom cut" },
                    Images = new() { "/assets/mens_3.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-43)
                },
                new Product
                {
                    Name = "Indigo Printed Mens Cotton Shirt",
                    Description = "Regular fit casual shirt printed with organic indigo dabu patterns. Smart style for semi-formal summer gatherings.",
                    Category = "Mens",
                    ImageUrl = "/assets/mens_4.png",
                    PriceRange = "₹999 - ₹1,999",
                    Fabric = "Cotton Cambric",
                    Occasion = "Weekend Outings & Travel",
                    Sizes = new() { "M", "L", "XL", "XXL" },
                    Images = new() { "/assets/mens_4.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-44)
                },

                // === Category: Combos (4 Items) ===
                new Product
                {
                    Name = "Mother-Daughter Matching Saree & Lehenga Set",
                    Description = "Beautiful coordinated set featuring matching georgette saree for mother and small lehenga-choli for daughter.",
                    Category = "Combos",
                    ImageUrl = "/assets/combo_1.png",
                    PriceRange = "₹4,999 - ₹12,999",
                    Fabric = "Soft Georgette",
                    Occasion = "Family Weddings & Receptions",
                    Sizes = new() { "Standard Saree", "Custom kids sizes" },
                    Images = new() { "/assets/combo_1.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-51)
                },
                new Product
                {
                    Name = "Kurta & Jacket Wedding Family Combo",
                    Description = "Complete family combo set including matching Nehru jacket and kurta sets for father, son, and matching suit set for mother.",
                    Category = "Combos",
                    ImageUrl = "/assets/combo_2.png",
                    PriceRange = "₹3,499 - ₹8,999",
                    Fabric = "Silk Cotton Blend",
                    Occasion = "Family Festive Events",
                    Sizes = new() { "Coordinated Family Set" },
                    Images = new() { "/assets/combo_2.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-52)
                },
                new Product
                {
                    Name = "Hand-Block Printed Bedding & Curtain Set",
                    Description = "Premium home combo featuring double size bedsheet, pillow covers, and matching cotton window curtains in Rajasthani print.",
                    Category = "Combos",
                    ImageUrl = "/assets/combo_3.png",
                    PriceRange = "₹2,299 - ₹5,500",
                    Fabric = "100% Cotton",
                    Occasion = "Home Decor & Gifting",
                    Sizes = new() { "Double Bedsheet + 2 Curtains" },
                    Images = new() { "/assets/combo_3.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-53)
                },
                new Product
                {
                    Name = "Premium Fabric & Matching Dupatta Combo",
                    Description = "Coordinated dress fabric piece with an exquisitely designed printed dupatta. Take it to your tailor for a unique custom suit.",
                    Category = "Combos",
                    ImageUrl = "/assets/combo_4.png",
                    PriceRange = "₹1,299 - ₹3,299",
                    Fabric = "Cotton Top + Silk Dupatta",
                    Occasion = "Ethnic Wear Gifting",
                    Sizes = new() { "2.5m Fabric + 2.25m Dupatta" },
                    Images = new() { "/assets/combo_4.png" },
                    CreatedAt = DateTime.UtcNow.AddMinutes(-54)
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
