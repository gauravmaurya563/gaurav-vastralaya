using System.Collections.Generic;
using System.Linq;
using backend.Models;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // Seed SAREES, SUITS, SHIRTING, READY-MADE if database is empty
            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Royal Banarasi Silk Saree",
                        Description = "A magnificent crimson red Banarasi silk saree woven with genuine gold-plated zari threads. Featuring a classic paisley border and a rich pallu, perfect for bridal wear and grand celebrations.",
                        Category = "Saree",
                        ImageUrl = "/assets/saree_premium.png",
                        PriceRange = "₹8,500 - ₹25,000",
                        Fabric = "Pure Banarasi Silk",
                        Occasion = "Bridal / Wedding",
                        Sizes = new() { "Unstitched (Free Size)" }
                    },
                    new Product
                    {
                        Name = "Elegant Kanjivaram Silk Saree",
                        Description = "Traditional handwoven Kanjivaram silk saree with a stunning contrast gold border and temple motifs. A timeless royal ensemble for any traditional ceremony.",
                        Category = "Saree",
                        ImageUrl = "/assets/saree_premium.png",
                        PriceRange = "₹12,000 - ₹35,000",
                        Fabric = "Pure Kanchipuram Silk",
                        Occasion = "Festive / Wedding",
                        Sizes = new() { "Unstitched (Free Size)" }
                    },
                    new Product
                    {
                        Name = "Designer Organza Floral Saree",
                        Description = "Lightweight, sheer organza saree decorated with delicate hand-painted pastel floral motifs and subtle sequin embroidery. Perfect for modern cocktails and daytime events.",
                        Category = "Saree",
                        ImageUrl = "/assets/saree_premium.png",
                        PriceRange = "₹3,500 - ₹9,500",
                        Fabric = "Premium Organza",
                        Occasion = "Day Party / Reception",
                        Sizes = new() { "Unstitched (Free Size)" }
                    },
                    new Product
                    {
                        Name = "Embellished Georgette Anarkali Suit",
                        Description = "Stunning floor-length Anarkali suit set in deep emerald green, adorned with intricate Zardozi hand-embroidery. Accompanied by a heavy net dupatta and comfortable pants.",
                        Category = "Suit",
                        ImageUrl = "/assets/suit_designer.png",
                        PriceRange = "₹4,800 - ₹12,500",
                        Fabric = "Faux Georgette & Shantoon",
                        Occasion = "Festive / Evening Wear",
                        Sizes = new() { "S", "M", "L", "XL", "XXL" }
                    },
                    new Product
                    {
                        Name = "Mirror Work Sharara Suit Set",
                        Description = "A vibrant mustard yellow cotton-silk short kurta with heavy mirror-work embroidery on the yoke, paired with a flared matching sharara and a ruffled organza dupatta.",
                        Category = "Suit",
                        ImageUrl = "/assets/suit_designer.png",
                        PriceRange = "₹3,800 - ₹8,500",
                        Fabric = "Cotton Silk Blend",
                        Occasion = "Haldi / Festive",
                        Sizes = new() { "S", "M", "L", "XL" }
                    },
                    new Product
                    {
                        Name = "Pastel Straight-Cut Palazzo Suit",
                        Description = "A sophisticated mint green straight-cut kurta featuring delicate Kashmiri thread embroidery, paired with wide-leg palazzos and a chiffon dupatta.",
                        Category = "Suit",
                        ImageUrl = "/assets/suit_designer.png",
                        PriceRange = "₹2,500 - ₹5,500",
                        Fabric = "Pure Cotton",
                        Occasion = "Formal / Office Wear",
                        Sizes = new() { "M", "L", "XL", "XXL" }
                    },
                    new Product
                    {
                        Name = "Premium Giza Cotton Shirting",
                        Description = "Ultra-premium Giza cotton fabric from the finest mills. Offers unmatched breathability, a silky smooth texture, and long-lasting lustre for custom executive shirts.",
                        Category = "Shirting",
                        ImageUrl = "/assets/shirting_fabric.png",
                        PriceRange = "₹800 - ₹2,500 per meter",
                        Fabric = "100% Giza Cotton",
                        Occasion = "Formal / Custom Tailoring",
                        Sizes = new() { "Cut Length (1.6m)", "Cut Length (2.0m)", "Custom Length" }
                    },
                    new Product
                    {
                        Name = "Luxury Italian Wool Suiting",
                        Description = "Fine Italian-blend merino wool fabric for bespoke suits, blazers, and trousers. Provides excellent drape, crease resistance, and a majestic matte finish.",
                        Category = "Shirting",
                        ImageUrl = "/assets/shirting_fabric.png",
                        PriceRange = "₹2,500 - ₹7,500 per meter",
                        Fabric = "Merino Wool Blend",
                        Occasion = "Wedding / Corporate Suit",
                        Sizes = new() { "Cut Length (3.2m for suit)", "Cut Length (1.5m for blazer)", "Custom Length" }
                    },
                    new Product
                    {
                        Name = "Georgette Chikankari Kurta Set",
                        Description = "Handcrafted Lucknowi Chikankari long kurta in pastel blue, featuring exquisite shadow work and border details, paired with white cotton trousers.",
                        Category = "Ready-made",
                        ImageUrl = "/assets/readymade_kurta.png",
                        PriceRange = "₹1,800 - ₹4,500",
                        Fabric = "Georgette with Cotton Lining",
                        Occasion = "Festive / Semi-Formal",
                        Sizes = new() { "S", "M", "L", "XL", "XXL" }
                    },
                    new Product
                    {
                        Name = "Brocade Indo-Western Sherwani",
                        Description = "A modern asymmetrical Indo-Western bandhgala sherwani in ivory brocade, woven with royal motifs. Paired with pre-stitched cowl dhoti pants.",
                        Category = "Ready-made",
                        ImageUrl = "/assets/readymade_kurta.png",
                        PriceRange = "₹9,500 - ₹22,000",
                        Fabric = "Silk Brocade",
                        Occasion = "Groom / Wedding Reception",
                        Sizes = new() { "38", "40", "42", "44" }
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}
