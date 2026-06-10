using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DiagnosticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetDiagnostics()
        {
            try
            {
                var conn = _context.Database.GetDbConnection();
                _context.Database.OpenConnection();
                
                string dbProvider = _context.Database.ProviderName ?? "Unknown";
                bool canConnect = _context.Database.CanConnect();
                
                // Check tables
                var tables = new List<string>();
                using (var cmd = conn.CreateCommand())
                {
                    if (_context.Database.IsSqlite())
                    {
                        cmd.CommandText = "SELECT name FROM sqlite_master WHERE type='table';";
                    }
                    else
                    {
                        cmd.CommandText = "SELECT table_name FROM information_schema.tables WHERE table_schema='public';";
                    }
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            tables.Add(reader.GetString(0));
                        }
                    }
                }

                // Check Products columns
                var columns = new List<string>();
                using (var cmd = conn.CreateCommand())
                {
                    if (_context.Database.IsSqlite())
                    {
                        cmd.CommandText = "PRAGMA table_info(Products);";
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                columns.Add(reader.GetString(1));
                            }
                        }
                    }
                    else
                    {
                        cmd.CommandText = "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND LOWER(table_name)='products';";
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                columns.Add(reader.GetString(0));
                            }
                        }
                    }
                }

                return Ok(new {
                    version = "v1.2-diagnostics",
                    provider = dbProvider,
                    canConnect = canConnect,
                    tables = tables,
                    productsColumns = columns
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    version = "v1.2-diagnostics",
                    error = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }
    }
}
