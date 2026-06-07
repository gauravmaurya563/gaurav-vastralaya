using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.Models;

namespace backend.Services
{
    public interface IProductService
    {
        IEnumerable<Product> GetAllProducts();
        Product? GetProductById(int id);
    }

    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Product> GetAllProducts()
        {
            return _context.Products.ToList();
        }

        public Product? GetProductById(int id)
        {
            return _context.Products.Find(id);
        }
    }
}
