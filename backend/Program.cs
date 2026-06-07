using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Connection string: use ENV VAR on Render/Railway, fallback to appsettings.json locally
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Register PostgreSQL DbContext (Neon.tech on production, local pg for dev)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register services as Scoped (since they depend on DbContext)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

// Configure OpenAPI (Swagger)
builder.Services.AddOpenApi();

// Configure CORS - allow local dev and production Vercel URL
var allowedOrigins = new[]
{
    "http://localhost:5173",                         // Local React Dev
    "https://gaurav-vastralyal.vercel.app",         // Vercel Production (update after deploy)
    // Add any other origins here if needed
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS before authorization and mapping controllers
app.UseCors("ReactAppPolicy");

// Only redirect HTTPS locally; on Render, handle SSL at load balancer level
if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

// Auto-create database and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated(); // Auto-creates DB & Tables based on models!
        DbInitializer.Seed(context);      // Seeds catalog data if empty
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating or seeding the database.");
    }
}

// Bind to PORT environment variable (Render requirement)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5121";
app.Run($"http://0.0.0.0:{port}");
