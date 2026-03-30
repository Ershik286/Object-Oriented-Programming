using Microsoft.AspNetCore.Mvc;

namespace OOP_lab2.WebAPI.Controllers {
    public class FrontendController : Controller {
        private readonly IHostApplicationLifetime _lifetime;
        private TechnicService techniService;

        public FrontendController(TechnicService technicService) {
            techniService = technicService;
        }

        [HttpPost("restart")]
        public IActionResult RestartFrontend() {
            Task.Run(() => _lifetime.StopApplication());

            techniService.GetAll();

            return Ok("Frontend restart initiated");
        }
    }
}
