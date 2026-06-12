using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Setting> Settings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL-compatible field configurations
            modelBuilder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(150);
            modelBuilder.Entity<Product>().Property(p => p.Category).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<Product>().Property(p => p.PriceRange).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<Product>().Property(p => p.SortOrder).HasDefaultValue(0);
            
            // Value converters to support list serialization on both SQLite and PostgreSQL
            modelBuilder.Entity<Product>().Property(p => p.Sizes)
                .HasConversion(
                    v => v != null ? string.Join(',', v) : string.Empty,
                    v => !string.IsNullOrEmpty(v) ? v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()
                );

            modelBuilder.Entity<Product>().Property(p => p.Images)
                .HasConversion(
                    v => v != null ? string.Join(',', v) : string.Empty,
                    v => !string.IsNullOrEmpty(v) ? v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>()
                );

            modelBuilder.Entity<Appointment>().Property(a => a.Name).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<Appointment>().Property(a => a.Phone).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Appointment>().Property(a => a.Date).IsRequired().HasMaxLength(15);
            modelBuilder.Entity<Appointment>().Property(a => a.TimeSlot).IsRequired().HasMaxLength(50);

            modelBuilder.Entity<AdminUser>().Property(u => u.Username).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<AdminUser>().Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);

            // AppUser (customer) configuration
            modelBuilder.Entity<AppUser>().Property(u => u.FullName).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<AppUser>().Property(u => u.Email).IsRequired().HasMaxLength(150);
            modelBuilder.Entity<AppUser>().Property(u => u.Phone).HasMaxLength(20);
            modelBuilder.Entity<AppUser>().Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
            modelBuilder.Entity<AppUser>().HasIndex(u => u.Email).IsUnique();
        }
    }
}
