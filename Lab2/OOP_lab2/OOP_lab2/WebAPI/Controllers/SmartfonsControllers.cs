using Microsoft.AspNetCore.Mvc;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class SmartfonsController : ControllerBase {
        private readonly TechnicService _technicService;

        public SmartfonsController(TechnicService technicService) {
            _technicService = technicService;
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
            var smartfon = _technicService.GetSmartfonList()
                .FirstOrDefault(s => {
                    var prop = s.GetType().GetProperty("Id");
                    return prop != null && (int)prop.GetValue(s) == id;
                });

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

        // DELETE: api/smartfons/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            Console.WriteLine("Delete Controller in Smartfon sound");

            try {
                var smartfon = _technicService.GetSmartfonList()
                    .FirstOrDefault(s => {
                        var prop = s.GetType().GetProperty("Id");
                        return prop != null && (int)prop.GetValue(s) == id;
                    });

                if (smartfon == null) {
                    return NotFound($"Смартфон с ID {id} не найден");
                }

                _technicService.Delete(id);

                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest($"Ошибка при удалении смартфона: {ex.Message}");
            }
        }
    }
}