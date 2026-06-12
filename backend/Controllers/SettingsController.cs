using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.Settings.ToListAsync();
            var dict = settings.ToDictionary(s => s.Key, s => s.Value);
            return Ok(dict);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> settings)
        {
            if (settings == null)
            {
                return BadRequest(new { message = "Settings dictionary is required." });
            }

            foreach (var kvp in settings)
            {
                var setting = await _context.Settings.FindAsync(kvp.Key);
                if (setting == null)
                {
                    setting = new Setting { Key = kvp.Key, Value = kvp.Value ?? string.Empty };
                    _context.Settings.Add(setting);
                }
                else
                {
                    setting.Value = kvp.Value ?? string.Empty;
                    _context.Entry(setting).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Settings updated successfully." });
        }
    }
}
