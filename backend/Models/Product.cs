namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Saree, Suit, Shirting, Ready-made
        public string ImageUrl { get; set; } = string.Empty;
        public string PriceRange { get; set; } = string.Empty;
        public string Fabric { get; set; } = string.Empty;
        public string Occasion { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new();
        public List<string> Images { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
