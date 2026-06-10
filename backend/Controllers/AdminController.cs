using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using System.Linq;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            var admin = _context.AdminUsers.FirstOrDefault(u => u.Username.ToLower() == loginDto.Username.ToLower());
            if (admin == null || !PasswordHelper.VerifyPassword(admin.PasswordHash, loginDto.Password))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            return Ok(new { 
                success = true, 
                username = admin.Username, 
                token = $"admin_session_{admin.Id}_{Guid.NewGuid():N}" 
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            if (registerDto == null || string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Lock limit to exactly 3 accounts total
            var existingCount = _context.AdminUsers.Count();
            if (existingCount >= 3)
            {
                return BadRequest(new { message = "Registration failed. A maximum of 3 administrator accounts is allowed." });
            }

            var alreadyExists = _context.AdminUsers.Any(u => u.Username.ToLower() == registerDto.Username.ToLower());
            if (alreadyExists)
            {
                return BadRequest(new { message = "Username already exists." });
            }

            var newUser = new AdminUser
            {
                Username = registerDto.Username,
                PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.AdminUsers.Add(newUser);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Administrator registered successfully.", count = existingCount + 1 });
        }

        [HttpGet("accounts-count")]
        public IActionResult GetAccountsCount()
        {
            var count = _context.AdminUsers.Count();
            return Ok(new { count });
        }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
