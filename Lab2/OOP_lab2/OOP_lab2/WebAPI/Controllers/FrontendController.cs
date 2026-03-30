using Microsoft.AspNetCore.Mvc;

namespace OOP_lab2.WebAPI.Controllers {
    public class FrontendController : Controller {
        private readonly IHostApplicationLifetime _lifetime;
        private TechnicService _techniService;

        public FrontendController(TechnicService technicService) {
            _techniService = technicService;
        }

        [HttpPost("restart")]
        public IActionResult RestartFrontend() {
            Task.Run(() => _lifetime.StopApplication());

            _techniService.GetAll();

            return Ok("Frontend restart initiated");
        }
    }
}
