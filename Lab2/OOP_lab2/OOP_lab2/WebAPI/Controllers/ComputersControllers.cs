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

        [HttpPost]
        public IActionResult Create([FromBody] Computer computer)
        {
            //Console.WriteLine("=== POST COMPUTER START ===");
            //Console.WriteLine($"Request received at: {DateTime.Now}");

            //// Логируем полученные данные
            if (computer == null){
                computer = new Computer();
            }

            //Console.WriteLine($"Computer data:");
            //Console.WriteLine($"  Name: {computer.Name}");
            //Console.WriteLine($"  Country: {computer.Country}");
            //Console.WriteLine($"  Enabled: {computer.Enabled}");
            //Console.WriteLine($"  ModelProcessor: {computer.ModelProcessor}");
            //Console.WriteLine($"  Ram: {computer.Ram}");
            //Console.WriteLine($"  Id: {computer.Id}");

            try{
                // Валидация обязательных полей
                if (string.IsNullOrEmpty(computer.Name)){
                    Console.WriteLine("ERROR: Name is required");
                    return BadRequest("Name is required");
                }

                if (string.IsNullOrEmpty(computer.ModelProcessor)){
                    Console.WriteLine("ERROR: ModelProcessor is required");
                    return BadRequest("ModelProcessor is required");
                }

                _technicService.CreateComputer(computer);
                Console.WriteLine($"Computer created successfully with ID: {computer.Id}");
                return CreatedAtAction(nameof(GetById), new { id = computer.Id }, computer);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest($"Ошибка при создании компьютера: {ex.Message}");
            }
        }

        // DELETE: api/computers/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            Console.WriteLine("Delete Controller in Computer sound");

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

                _technicService.Delete(id);

                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении компьютера: {ex.Message}");
            }
        }
    }
}