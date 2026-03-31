using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using System.Text.Json;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class TechnicsController : ControllerBase {
        private readonly TechnicService _technicService;
        private readonly AppDbContext _dbContext;

        public TechnicsController(TechnicService technicService, AppDbContext dbContext) {
            _technicService = technicService;
            _dbContext = dbContext;
        }

        // GET: api/technics
        [HttpGet]
        public IActionResult GetAll() {
            var technics = _technicService.GetAll();
            Console.WriteLine("Возврат данных таблицы Technics");
            return Ok(technics);
        }

        // GET: api/technics/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var technic = _technicService.GetById(id);
            if (technic == null) {
                return NotFound($"Техника с ID {id} не найдена");
            }
            return Ok(technic);
        }

        // POST: api/technics
        [HttpPost]
        public IActionResult Create([FromBody] Technic technic) {
            if (technic == null) {
                return BadRequest("Данные техники не могут быть пустыми");
            }

            try {
                _technicService.Create(technic);
                return CreatedAtAction(nameof(GetById), new { id = technic.Id }, technic);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при создании: {ex.Message}");
            }
        }

        // PUT: api/technics/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] JsonElement updateData) {
            var existingTechnic = _technicService.GetById(id);
            if (existingTechnic == null) {
                return NotFound($"Техника с ID {id} не найдена");
            }

            try {
                // Обновляем только переданные поля
                if (updateData.TryGetProperty("name", out var name)) {
                    existingTechnic.Name = name.GetString();
                }
                if (updateData.TryGetProperty("country", out var country)) {
                    existingTechnic.Country = country.GetString();
                }
                if (updateData.TryGetProperty("enabled", out var enabled)) {
                    existingTechnic.Enabled = enabled.GetBoolean();
                }

                _technicService.Update(existingTechnic);
                return Ok(existingTechnic);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при обновлении: {ex.Message}");
            }
        }

        // DELETE: api/technics/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            var technic = _technicService.GetById(id);
            if (technic == null) {
                return NotFound($"Техника с ID {id} не найдена");
            }

            try {
                _technicService.Delete(id);
                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении: {ex.Message}");
            }
        }

        // POST: api/technics/{id}/call-method
        [HttpPost("{id}/call-method")]
        public IActionResult CallMethod(int id, [FromBody] MethodCallDto callDto) {
            var technic = _technicService.GetById(id);
            if (technic == null) {
                return NotFound($"Техника с ID {id} не найдена");
            }

            try {
                var method = technic.GetType().GetMethod(callDto.MethodName);
                if (method == null) {
                    return BadRequest($"Метод {callDto.MethodName} не найден");
                }

                // Перехватываем вывод Console.WriteLine
                var stringWriter = new StringWriter();
                var originalOut = Console.Out;
                Console.SetOut(stringWriter);

                try {
                    var result = method.Invoke(technic, null);
                    var consoleOutput = stringWriter.ToString();

                    // Формируем вывод: если метод вернул значение, добавляем его
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

        [HttpDelete("deleteInID/{id}")]
        public IActionResult DeleteInID(int id) {
            return Delete(id);
        }

        // GET: api/technics/count
        [HttpGet("count")]
        public IActionResult GetCount() {
            try {
                var count = _technicService.GetCount();
                return Ok(new { count });
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при подсчете: {ex.Message}");
            }
        }

        // GET: api/technics/rawsql?country=China
        [HttpGet("rawsql")]
        public IActionResult GetByRawSql([FromQuery] string country) {
            try {
                var technics = _technicService.GetByRawSql(country);
                return Ok(technics);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при выполнении SQL запроса: {ex.Message}");
            }
        }

        [HttpHead("{id}")]
        public IActionResult CheckExists(int id) {
            var exists = _technicService.GetById(id) != null;
            return exists ? Ok() : NotFound();
        }
    }

    public class MethodCallDto {
        public string MethodName { get; set; }
        public object[] Args { get; set; }
    }
}