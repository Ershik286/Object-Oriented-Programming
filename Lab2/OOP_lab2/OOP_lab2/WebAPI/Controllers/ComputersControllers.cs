using Microsoft.AspNetCore.Mvc;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class ComputersController : ControllerBase {
        private readonly TechnicService _technicService;
        private readonly AppDbContext _dbContext;

        public ComputersController(TechnicService technicService, AppDbContext dbContext) {
            _technicService = technicService;
            _dbContext = dbContext;
        }

        // GET: api/computers
        [HttpGet]
        public IActionResult GetAll() {
            var computers = _technicService.GetComputersWithDetails();
            return Ok(computers);
        }

        // GET: api/computers/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var computer = _dbContext.Computers.FirstOrDefault(c => c.Id == id);
            if (computer == null) {
                return NotFound($"Компьютер с ID {id} не найден");
            }
            return Ok(computer);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Computer computer) {
            if (computer == null) {
                computer = new Computer();
            }

            try {
                if (string.IsNullOrEmpty(computer.Name)) {
                    return BadRequest("Name is required");
                }

                if (string.IsNullOrEmpty(computer.ModelProcessor)) {
                    return BadRequest("ModelProcessor is required");
                }

                _technicService.CreateComputer(computer);
                return CreatedAtAction(nameof(GetById), new { id = computer.Id }, computer);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при создании компьютера: {ex.Message}");
            }
        }

        // PUT: api/computers/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] JsonElement updateData) {
            var computer = _dbContext.Computers.FirstOrDefault(c => c.Id == id);
            if (computer == null) {
                return NotFound($"Компьютер с ID {id} не найден");
            }

            try {
                if (updateData.TryGetProperty("modelProcessor", out var processor)) {
                    computer.ModelProcessor = processor.GetString();
                }
                if (updateData.TryGetProperty("ram", out var ram)) {
                    computer.Ram = ram.GetInt32();
                }
                if (updateData.TryGetProperty("name", out var name)) {
                    computer.Name = name.GetString();
                }
                if (updateData.TryGetProperty("country", out var country)) {
                    computer.Country = country.GetString();
                }
                if (updateData.TryGetProperty("enabled", out var enabled)) {
                    computer.Enabled = enabled.GetBoolean();
                }

                _dbContext.SaveChanges();
                return Ok(computer);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при обновлении: {ex.Message}");
            }
        }

        // POST: api/computers/{id}/call-method
        [HttpPost("{id}/call-method")]
        public IActionResult CallMethod(int id, [FromBody] MethodCallDto callDto) {
            var computer = _dbContext.Computers.FirstOrDefault(c => c.Id == id);
            if (computer == null) {
                return NotFound($"Компьютер с ID {id} не найден");
            }

            try {
                var method = computer.GetType().GetMethod(callDto.MethodName);
                if (method == null) {
                    return BadRequest($"Метод {callDto.MethodName} не найден");
                }

                // Перехватываем вывод Console.WriteLine
                var stringWriter = new StringWriter();
                var originalOut = Console.Out;
                Console.SetOut(stringWriter);

                try {
                    var result = method.Invoke(computer, null);
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

        // DELETE: api/computers/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            try {
                var computer = _dbContext.Computers.FirstOrDefault(c => c.Id == id);
                if (computer == null) {
                    return NotFound($"Компьютер с ID {id} не найден");
                }

                _dbContext.Computers.Remove(computer);
                _dbContext.SaveChanges();
                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении компьютера: {ex.Message}");
            }
        }
    }
}