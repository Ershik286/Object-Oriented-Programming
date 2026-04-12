using Microsoft.AspNetCore.Mvc;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.IO;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class SmartfonsController : ControllerBase {
        private readonly TechnicService _technicService;
        private readonly AppDbContext _dbContext;

        public SmartfonsController(TechnicService technicService, AppDbContext dbContext) {
            _technicService = technicService;
            _dbContext = dbContext;
        }

        // GET: api/smartfons
        [HttpGet]
        public IActionResult GetAll() {
            var smartfons = _technicService.GetSmartfonList();
            return Ok(smartfons);
        }

        // GET: api/smartfons/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var smartfon = _dbContext.Smartfons.FirstOrDefault(s => s.Id == id);
            if (smartfon == null) {
                return NotFound($"Смартфон с ID {id} не найден");
            }
            return Ok(smartfon);
        }

        // POST: api/smartfons
        [HttpPost]
        public IActionResult Create([FromBody] Smartfon smartfon) {
            if (smartfon == null) {
                smartfon = new Smartfon();
            }

            try {
                _technicService.CreateSmartfon(smartfon);
                return CreatedAtAction(nameof(GetById), new { id = smartfon.Id }, smartfon);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при создании смартфона: {ex.Message}");
            }
        }

        // PUT: api/smartfons/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] JsonElement updateData) {
            var smartfon = _dbContext.Smartfons.FirstOrDefault(s => s.Id == id);
            if (smartfon == null) {
                return NotFound($"Смартфон с ID {id} не найден");
            }

            try {
                if (updateData.TryGetProperty("cameraMP", out var camera)) {
                    smartfon.CameraMP = camera.GetInt32();
                }
                if (updateData.TryGetProperty("manufactures", out var manufacturer)) {
                    smartfon.Manufactures = manufacturer.GetString();
                }
                if (updateData.TryGetProperty("name", out var name)) {
                    smartfon.Name = name.GetString();
                }
                if (updateData.TryGetProperty("country", out var country)) {
                    smartfon.Country = country.GetString();
                }
                if (updateData.TryGetProperty("enabled", out var enabled)) {
                    smartfon.Enabled = enabled.GetBoolean();
                }
                if (updateData.TryGetProperty("isCall", out var isCall)) {
                    smartfon.IsCall = isCall.GetBoolean();
                }

                _dbContext.SaveChanges();
                return Ok(smartfon);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при обновлении: {ex.Message}");
            }
        }

        // POST: api/smartfons/{id}/call-method
        [HttpPost("{id}/call-method")]
        public IActionResult CallMethod(int id, [FromBody] MethodCallDto callDto) {
            var smartfon = _dbContext.Smartfons.FirstOrDefault(s => s.Id == id);
            if (smartfon == null) {
                return NotFound($"Смартфон с ID {id} не найден");
            }

            try {
                var method = smartfon.GetType().GetMethod(callDto.MethodName);
                if (method == null) {XmlConfigurationExtensions
                    return BadRequest($"Метод {callDto.MethodName} не найден");
                }

                // Перехватываем вывод Console.WriteLine (как в ComputersController)
                var stringWriter = new StringWriter();
                var originalOut = Console.Out;
                Console.SetOut(stringWriter);

                try {
                    var result = method.Invoke(smartfon, null);
                    var consoleOutput = stringWriter.ToString();

                    string output = consoleOutput;
                    if (result != null && !string.IsNullOrEmpty(result.ToString())) {
                        output += (output.Length > 0 ? "\n" : "") + $"Возвращаемое значение: {result}";
                    }

                    _dbContext.SaveChanges();

                    return Ok(new {
                        message = "Метод выполнен успешно",
                        methodName = callDto.MethodName,
                        output = output.Trim()
                    });
                }
                finally {
                    Console.SetOut(originalOut);
                }
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при вызове метода: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // DELETE: api/smartfons/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            try {
                var smartfon = _dbContext.Smartfons.FirstOrDefault(s => s.Id == id);
                if (smartfon == null) {
                    return NotFound($"Смартфон с ID {id} не найден");
                }

                _dbContext.Smartfons.Remove(smartfon);
                _dbContext.SaveChanges();
                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении смартфона: {ex.Message}");
            }
        }
    }
}