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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL-compatible field configurations
            modelBuilder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(150);
            modelBuilder.Entity<Product>().Property(p => p.Category).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<Product>().Property(p => p.PriceRange).IsRequired().HasMaxLength(100);
            
            // Value converters to support list serialization on SQLite and Postgres
            modelBuilder.Entity<Product>().Property(p => p.Sizes)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
            modelBuilder.Entity<Product>().Property(p => p.Images)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );

            modelBuilder.Entity<Appointment>().Property(a => a.Name).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<Appointment>().Property(a => a.Phone).IsRequired().HasMaxLength(20);
            modelBuilder.Entity<Appointment>().Property(a => a.Date).IsRequired().HasMaxLength(15);
            modelBuilder.Entity<Appointment>().Property(a => a.TimeSlot).IsRequired().HasMaxLength(50);

            modelBuilder.Entity<AdminUser>().Property(u => u.Username).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<AdminUser>().Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        }
    }
}
