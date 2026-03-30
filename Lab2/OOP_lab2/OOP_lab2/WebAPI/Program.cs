using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OOP_lab2.Class;

namespace OOP_lab2.WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(AppDbContext.connectionString)
                       .EnableSensitiveDataLogging()
                       .LogTo(Console.WriteLine, LogLevel.Information));

            builder.Services.AddScoped<TechnicService>();

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddControllers()
            .ConfigureApiBehaviorOptions(options => {
                // Включаем детальное логирование ошибок валидации
                options.InvalidModelStateResponseFactory = context => {
                    var errors = context.ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage);

                    Console.WriteLine("=== MODEL VALIDATION ERRORS ===");
                    foreach (var error in errors)
                    {
                        Console.WriteLine(error);
                    }

                    return new BadRequestObjectResult(new { errors });
                };
            });

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowFrontendApp", policy => {
                    policy.WithOrigins(
                        "http://localhost:60526",
                        "http://localhost:3000",
                        "http://127.0.0.1:5500"
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                try
                {
                    Console.WriteLine("=== Applying migrations ===");

                    dbContext.Database.Migrate();

                    Console.WriteLine("=== Migrations applied successfully ===");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"=== Error applying migrations: {ex.Message} ===");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");

                    try
                    {
                        Console.WriteLine("Trying EnsureCreated...");
                        dbContext.Database.EnsureCreated();
                        Console.WriteLine("Tables created successfully");
                    }
                    catch (Exception ex2)
                    {
                        Console.WriteLine($"Error: {ex2.Message}");
                        throw;
                    }
                }
            }

            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontendApp");
            app.UseAuthorization();
            app.MapControllers();

            app.MapGet("/", async context => {
                context.Response.Redirect("/index.html");
            });

            app.Run();
        }
    }
}