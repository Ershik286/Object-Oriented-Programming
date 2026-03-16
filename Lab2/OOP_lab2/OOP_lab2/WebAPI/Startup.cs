using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace OOP_lab2.WebAPI {
    public class Startup {

        public IConfiguration configuration { get; }

        public Startup(IConfiguration configuration) {
            this.configuration = configuration;

            var connString = configuration.GetConnectionString("DefaultConnection");
            Console.WriteLine($"Connection string: {connString}");
        }

        public void ConfigureServices(IServiceCollection services) {
            services.AddControllers();

            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo {
                    Title = "Technic API",
                    Version = "v1",
                    Description = "API для управления техникой"
                });
            });

            services.AddCors(options => {
                options.AddPolicy("AllowFrontendApp", policy => {
                    policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:5500")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontendApp");
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
