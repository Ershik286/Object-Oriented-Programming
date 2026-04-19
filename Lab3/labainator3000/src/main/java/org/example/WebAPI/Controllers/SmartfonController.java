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
@RequestMapping("/api/smartfon")
public class SmartfonController {

    @Autowired
    private TechnicService technicService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSmartfons() {
        try {
            List<Map<String, Object>> smartfons = technicService.getSmartfonList();
            return ResponseEntity.ok(smartfons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Smartfon> getSmartfonById(@PathVariable Long id) {
        try {
            Smartfon smartfon = technicService.getSmartfonById(id);
            if (smartfon != null) {
                return ResponseEntity.ok(smartfon);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PATCH - частичное обновление смартфона
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchUpdate(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Smartfon smartfon = technicService.getSmartfonById(id);
            if (smartfon == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();

            if (updates.containsKey("name")) {
                smartfon.setName((String) updates.get("name"));
                response.put("name", updates.get("name"));
            }
            if (updates.containsKey("country")) {
                smartfon.setCountry((String) updates.get("country"));
                response.put("country", updates.get("country"));
            }
            if (updates.containsKey("enabled")) {
                smartfon.setEnabled((boolean) updates.get("enabled"));
                response.put("enabled", updates.get("enabled"));
            }
            if (updates.containsKey("cameraMP")) {
                smartfon.setCameraMP(((Number) updates.get("cameraMP")).intValue());
                response.put("cameraMP", updates.get("cameraMP"));
            }
            if (updates.containsKey("manufactures")) {
                smartfon.setManufactures((String) updates.get("manufactures"));
                response.put("manufactures", updates.get("manufactures"));
            }
            if (updates.containsKey("isCall")) {
                smartfon.setIsCall((boolean) updates.get("isCall"));
                response.put("isCall", updates.get("isCall"));
            }
            if (updates.containsKey("shopId")) {
                Long shopId = updates.get("shopId") != null ? ((Number) updates.get("shopId")).longValue() : null;
                ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
                smartfon.setShop(shop);
                response.put("shopId", shopId);
            }

            technicService.update(smartfon);
            response.put("status", "success");
            response.put("message", "Смартфон обновлён");
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

            Smartfon smartfon = technicService.getSmartfonById(id);
            Map<String, Object> response = new HashMap<>();

            switch (methodName) {
                case "displayInfo":
                    response.put("status", "success");
                    response.put("data", smartfon.displayInfo());
                    break;
                case "calculatePowerConsumption":
                    response.put("status", "success");
                    response.put("data", smartfon.calculatePowerConsumption());
                    break;
                case "switchDevice":
                    smartfon.setEnabled(!smartfon.isEnabled());
                    technicService.update(smartfon);
                    response.put("status", "success");
                    response.put("message", "Смартфон " + (smartfon.isEnabled() ? "включен" : "выключен"));
                    break;
                case "takePhoto":
                    smartfon.takePhoto();
                    response.put("status", "success");
                    response.put("message", "Фото сделано камерой " + smartfon.getCameraMP() + " МП");
                    break;
                case "call":
                    smartfon.call();
                    technicService.update(smartfon);
                    response.put("status", "success");
                    response.put("message", "Звонок начат");
                    break;
                case "reset":
                    smartfon.reset();
                    technicService.update(smartfon);
                    response.put("status", "success");
                    response.put("message", "Звонок сброшен");
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

    @PostMapping("/default")
    public ResponseEntity<Smartfon> createDefaultSmartfon() {
        try {
            Smartfon smartfon = new Smartfon();
            technicService.createSmartfon(smartfon);
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Smartfon> createSmartfon(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            int cameraMP = ((Number) data.get("cameraMP")).intValue();
            String manufactures = (String) data.get("manufactures");
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;
            ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
            Smartfon smartfon = new Smartfon(name, cameraMP, manufactures, shop);
            technicService.createSmartfon(smartfon);
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create-full")
    public ResponseEntity<Smartfon> createSmartfonFull(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            String country = (String) data.getOrDefault("country", "China");
            boolean enabled = (boolean) data.getOrDefault("enabled", false);
            int cameraMP = ((Number) data.get("cameraMP")).intValue();
            boolean isCall = (boolean) data.getOrDefault("isCall", false);
            String manufactures = (String) data.get("manufactures");
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;
            ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
            Smartfon smartfon = new Smartfon(name, country, enabled, cameraMP, isCall, manufactures, shop);
            technicService.createSmartfon(smartfon);
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSmartfon(@PathVariable Long id) {
        try {
            Smartfon existing = technicService.getSmartfonById(id);
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