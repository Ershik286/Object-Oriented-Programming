package org.example.WebAPI.Controllers;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.Computer;
import org.example.WebAPI.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.example.Class.*;

@RestController
@RequestMapping("/api/computer")
public class ComputerController {

    @Autowired
    private TechnicService technicService;

    // GET all computers
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllComputers() {
        try {
            List<Map<String, Object>> computers = technicService.getComputersWithDetails();
            return ResponseEntity.ok(computers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET computer by id
    @GetMapping("/{id}")
    public ResponseEntity<Computer> getComputerById(@PathVariable Long id) {
        try {
            Technic technic = technicService.getById(id);
            if (technic instanceof Computer) {
                return ResponseEntity.ok((Computer) technic);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/call_method")
    public ResponseEntity<Map<String, Object>> callMethod(@RequestBody MethodInfo callMethod) {
        try {
            Map<String, Object> response = Map.of(
                    "status", "success",
                    "message", "Метод " + callMethod.getMethodName() + " вызван для компьютера",
                    "methodInfo", callMethod
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST create computer (конструктор 1 - по умолчанию)
    @PostMapping("/default")
    public ResponseEntity<Computer> createDefaultComputer() {
        try {
            Computer computer = new Computer();
            technicService.createComputer(computer);
            return ResponseEntity.status(HttpStatus.CREATED).body(computer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST create computer (конструктор 2 - с параметрами)
    @PostMapping("/create")
    public ResponseEntity<Computer> createComputer(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            String modelProcessor = (String) data.get("modelProcessor");
            int ram = ((Number) data.get("ram")).intValue();
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;

            ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
            Computer computer = new Computer(name, modelProcessor, ram, shop);
            technicService.createComputer(computer);
            return ResponseEntity.status(HttpStatus.CREATED).body(computer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST create computer (конструктор 3 - полный)
    @PostMapping("/create-full")
    public ResponseEntity<Computer> createComputerFull(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            String country = (String) data.get("country");
            boolean enabled = (boolean) data.getOrDefault("enabled", false);
            String modelProcessor = (String) data.get("modelProcessor");
            int ram = ((Number) data.get("ram")).intValue();
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;

            ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
            Computer computer = new Computer(name, country, enabled, modelProcessor, ram, shop);
            technicService.createComputer(computer);
            return ResponseEntity.status(HttpStatus.CREATED).body(computer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}