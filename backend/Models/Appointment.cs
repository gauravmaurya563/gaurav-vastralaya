using System;

namespace backend.Models
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty; // YYYY-MM-DD
        public string TimeSlot { get; set; } = string.Empty; // e.g. 11:00 AM - 12:30 PM
        public string Category { get; set; } = string.Empty; // Saree, Suit, Custom Tailoring, Ready-made
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
