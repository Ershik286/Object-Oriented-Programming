using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OOP_lab2.Class;
using System.Collections.Generic;
using System.Linq;

namespace OOP_lab2.WebAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class TechnicsController : ControllerBase {
        private readonly TechnicService _technicService;

        public TechnicsController(TechnicService technicService) {
            _technicService = technicService;
        }

        [HttpGet]
        public IActionResult getALL() { 
            var technics = _technicService.GetAll();
            Console.WriteLine("Возврат данных таблицы Technics");
            return Ok(technics);
        }
    }
}