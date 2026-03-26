using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class TechnicsController : ControllerBase {
        private readonly TechnicService _technicService;

        public TechnicsController(TechnicService technicService) {
            _technicService = technicService;
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
        public IActionResult Update(int id, [FromBody] Technic updatedTechnic) {
            if (updatedTechnic == null || id != updatedTechnic.Id) {
                return BadRequest("ID в запросе не совпадает с ID объекта");
            }

            var existingTechnic = _technicService.GetById(id);
            if (existingTechnic == null) {
                return NotFound($"Техника с ID {id} не найдена");
            }

            try {
                _technicService.Update(updatedTechnic);
                return Ok(updatedTechnic);
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

        // HEAD: api/technics/{id} - проверка существования
        [HttpHead("{id}")]
        public IActionResult CheckExists(int id) {
            var exists = _technicService.GetById(id) != null;
            return exists ? Ok() : NotFound();
        }
    }
}