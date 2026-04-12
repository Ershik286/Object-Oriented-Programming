package org.example.WebAPI.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Map;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/index.html";
    }

    @GetMapping("/api/info")
    @ResponseBody
    public Map<String, String> apiInfo() {
        return Map.of(
                "message", "Technic Management System API",
                "status", "running",
                "endpoints", "/api/technic, /api/computer, /api/smartfon"
        );
    }
}