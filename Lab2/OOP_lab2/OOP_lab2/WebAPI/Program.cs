using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OOP_lab2.Class;

namespace OOP_lab2.WebAPI {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(AppDbContext.connectionString));

            builder.Services.AddScoped<TechnicService>();

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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

            app.UseStaticFiles();

            if (app.Environment.IsDevelopment()) {
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