using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using System;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserAuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/UserAuth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest(new { message = "Full name, email, and password are required." });
            }

            // Validate email format
            if (!dto.Email.Contains("@") || !dto.Email.Contains("."))
            {
                return BadRequest(new { message = "Please enter a valid email address." });
            }

            // Validate password length
            if (dto.Password.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters long." });
            }

            // Check if email already registered
            var existingUser = _context.AppUsers
                .FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUser != null)
            {
                return BadRequest(new { message = "An account with this email already exists. Please log in instead." });
            }

            var newUser = new AppUser
            {
                FullName = dto.FullName.Trim(),
                Email = dto.Email.Trim().ToLower(),
                Phone = dto.Phone?.Trim() ?? string.Empty,
                PasswordHash = PasswordHelper.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.AppUsers.Add(newUser);
            _context.SaveChanges();

            var token = GenerateToken(newUser);

            return Ok(new
            {
                success = true,
                token,
                user = new
                {
                    id = newUser.Id,
                    fullName = newUser.FullName,
                    email = newUser.Email,
                    phone = newUser.Phone,
                    createdAt = newUser.CreatedAt
                }
            });
        }

        // POST /api/UserAuth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var user = _context.AppUsers
                .FirstOrDefault(u => u.Email.ToLower() == dto.Email.Trim().ToLower());

            if (user == null || !PasswordHelper.VerifyPassword(user.PasswordHash, dto.Password))
            {
                return Unauthorized(new { message = "Invalid email or password. Please try again." });
            }

            var token = GenerateToken(user);

            return Ok(new
            {
                success = true,
                token,
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    phone = user.Phone,
                    createdAt = user.CreatedAt
                }
            });
        }

        // GET /api/UserAuth/profile
        [HttpGet("profile")]
        public IActionResult GetProfile([FromHeader(Name = "X-User-Token")] string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return Unauthorized(new { message = "Authentication token is required." });

            var userId = ParseUserIdFromToken(token);
            if (userId == null)
                return Unauthorized(new { message = "Invalid or expired session token." });

            var user = _context.AppUsers.Find(userId);
            if (user == null)
                return NotFound(new { message = "User account not found." });

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phone = user.Phone,
                createdAt = user.CreatedAt
            });
        }

        // Simple token generation: "user_session_{id}_{guid}"
        private static string GenerateToken(AppUser user)
            => $"user_session_{user.Id}_{Guid.NewGuid():N}";

        private static int? ParseUserIdFromToken(string token)
        {
            // Format: user_session_{id}_{guid}
            var parts = token.Split('_');
            if (parts.Length >= 3 && int.TryParse(parts[2], out var id))
                return id;
            return null;
        }
    }

    public class UserRegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class UserLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
