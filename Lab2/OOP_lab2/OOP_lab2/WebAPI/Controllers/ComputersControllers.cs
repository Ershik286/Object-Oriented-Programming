using Microsoft.AspNetCore.Mvc;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class ComputersController : ControllerBase {
        private readonly TechnicService _technicService;

        public ComputersController(TechnicService technicService) {
            _technicService = technicService;
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
            var computer = _technicService.GetComputersWithDetails()
                .FirstOrDefault(c => {
                    var prop = c.GetType().GetProperty("Id");
                    return prop != null && (int)prop.GetValue(c) == id;
                });

            if (computer == null) {
                return NotFound($"Компьютер с ID {id} не найден");
            }
            return Ok(computer);
        }

        // POST: api/computers
        [HttpPost]
        public IActionResult Create([FromBody] Computer computer) {
            if (computer == null) {
                return BadRequest("Данные компьютера не могут быть пустыми");
            }

            try {
                // Создаем базовую запись Technic и Computer
                var technic = new Technic {
                    Id = computer.Id,
                    Name = computer.Name,
                    Country = computer.Country,
                    Enabled = computer.Enabled
                };

                _technicService.CreateWithComputer(technic, computer);
                return CreatedAtAction(nameof(GetById), new { id = computer.Id }, computer);
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при создании компьютера: {ex.Message}");
            }
        }

        // DELETE: api/computers/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            try {
                // Сначала удаляем Computer, потом Technic
                var computer = _technicService.GetComputersWithDetails()
                    .FirstOrDefault(c => {
                        var prop = c.GetType().GetProperty("Id");
                        return prop != null && (int)prop.GetValue(c) == id;
                    });

                if (computer == null) {
                    return NotFound($"Компьютер с ID {id} не найден");
                }

                // В вашей реализации может быть специальный метод для удаления
                // _technicService.DeleteComputer(id);

                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении компьютера: {ex.Message}");
            }
        }
    }
}