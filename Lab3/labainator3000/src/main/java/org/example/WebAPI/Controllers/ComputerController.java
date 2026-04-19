package org.example.WebAPI.Controllers;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/computer")
public class ComputerController {

    @Autowired
    private TechnicService technicService;

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

    // PATCH - частичное обновление компьютера
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchUpdate(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Computer computer = technicService.getComputerById(id);
            if (computer == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();

            if (updates.containsKey("name")) {
                computer.setName((String) updates.get("name"));
                response.put("name", updates.get("name"));
            }
            if (updates.containsKey("country")) {
                computer.setCountry((String) updates.get("country"));
                response.put("country", updates.get("country"));
            }
            if (updates.containsKey("enabled")) {
                computer.setEnabled((boolean) updates.get("enabled"));
                response.put("enabled", updates.get("enabled"));
            }
            if (updates.containsKey("modelProcessor")) {
                computer.setModelProcessor((String) updates.get("modelProcessor"));
                response.put("modelProcessor", updates.get("modelProcessor"));
            }
            if (updates.containsKey("ram")) {
                computer.setRam(((Number) updates.get("ram")).intValue());
                response.put("ram", updates.get("ram"));
            }
            if (updates.containsKey("shopId")) {
                Long shopId = updates.get("shopId") != null ? ((Number) updates.get("shopId")).longValue() : null;
                ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
                computer.setShop(shop);
                response.put("shopId", shopId);
            }

            technicService.update(computer);
            response.put("status", "success");
            response.put("message", "Компьютер обновлён");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/call_method")
    public ResponseEntity<Map<String, Object>> callMethod(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            Map<String, Object> methodInfoMap = (Map<String, Object>) request.get("methodInfo");
            String methodName = (String) methodInfoMap.get("methodName");

            Computer computer = technicService.getComputerById(id);
            Map<String, Object> response = new HashMap<>();

            switch (methodName) {
                case "displayInfo":
                    response.put("status", "success");
                    response.put("data", computer.displayInfo());
                    break;
                case "switchDevice":
                    computer.switchDevice();
                    technicService.update(computer);
                    response.put("status", "success");
                    response.put("message", "Компьютер " + (computer.isEnabled() ? "включен" : "выключен"));
                    break;
                case "calculatePowerConsumption":
                    response.put("status", "success");
                    response.put("data", computer.calculatePowerConsumption());
                    break;
                default:
                    response.put("status", "error");
                    response.put("message", "Неизвестный метод: " + methodName);
                    return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/call_method/upgradeProcessor")
    public ResponseEntity<Map<String, Object>> upgradeProcessor(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            String newProcessor = (String) request.get("newProcessor");

            Computer computer = technicService.getComputerById(id);
            boolean success = computer.upgradeProcessor(newProcessor);
            if (success) {
                technicService.update(computer);
                return ResponseEntity.ok(Map.of("status", "success", "message", "Процессор обновлён на " + newProcessor));
            } else {
                return ResponseEntity.ok(Map.of("status", "error", "message", "Не удалось обновить процессор"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/call_method/changeRam")
    public ResponseEntity<Map<String, Object>> changeRam(@RequestBody Map<String, Object> request) {
        try {
            Long id = ((Number) request.get("id")).longValue();
            int newRam = ((Number) request.get("newRam")).intValue();

            Computer computer = technicService.getComputerById(id);
            boolean success = computer.changeRam(newRam);
            if (success) {
                technicService.update(computer);
                return ResponseEntity.ok(Map.of("status", "success", "message", "RAM изменён на " + newRam + " ГБ"));
            } else {
                return ResponseEntity.ok(Map.of("status", "error", "message", "Не удалось изменить RAM"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/default")
    public ResponseEntity<Computer> createDefaultComputer() {
        try {
            Computer computer = new Computer();
            technicService.createComputer(computer);
            return ResponseEntity.status(HttpStatus.CREATED).body(computer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComputer(@PathVariable Long id) {
        try {
            Computer existing = technicService.getComputerById(id);
            if (existing != null) {
                technicService.delete(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}