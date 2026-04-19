package org.example.WebAPI.Controllers;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.Technic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.example.Class.*;

@RestController
@RequestMapping("/api/technic")
public class TechnicController {

    @Autowired
    private TechnicService technicService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        try {
            List<Map<String, Object>> technics = technicService.getAllTechnicsWithShop();
            return ResponseEntity.ok(technics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Technic> getById(@PathVariable Long id) {
        try {
            Technic technic = technicService.getById(id);
            if (technic != null) {
                return ResponseEntity.ok(technic);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Technic> create(@RequestBody Technic technic) {
        try {
            technicService.create(technic);
            return ResponseEntity.status(HttpStatus.CREATED).body(technic);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE - обновление полей техники
    @PutMapping("/{id}")
    public ResponseEntity<Technic> update(@PathVariable Long id, @RequestBody Technic technic) {
        try {
            Technic existing = technicService.getById(id);
            if (existing != null) {
                technic.setId(id);
                technicService.update(technic);
                return ResponseEntity.ok(technic);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PATCH - частичное обновление техники
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchUpdate(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Technic technic = technicService.getById(id);
            if (technic == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();

            if (updates.containsKey("name")) {
                String newName = (String) updates.get("name");
                technic.setName(newName);
                response.put("name", newName);
            }
            if (updates.containsKey("country")) {
                String newCountry = (String) updates.get("country");
                technic.setCountry(newCountry);
                response.put("country", newCountry);
            }
            if (updates.containsKey("enabled")) {
                boolean newEnabled = (boolean) updates.get("enabled");
                technic.setEnabled(newEnabled);
                response.put("enabled", newEnabled);
            }
            if (updates.containsKey("shopId")) {
                Long shopId = updates.get("shopId") != null ? ((Number) updates.get("shopId")).longValue() : null;
                ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
                technic.setShop(shop);
                response.put("shopId", shopId);
            }

            technicService.update(technic);
            response.put("status", "success");
            response.put("message", "Техника обновлена");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            Technic existing = technicService.getById(id);
            if (existing != null) {
                technicService.delete(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
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
            if (methodInfoMap == null) {
                throw new IllegalArgumentException("MethodInfo not found");
            }
            String methodName = (String) methodInfoMap.get("methodName");

            Technic technic = technicService.getById(id);
            if (technic == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();

            switch (methodName) {
                case "displayInfo":
                    response.put("status", "success");
                    response.put("data", technic.displayInfo());
                    break;
                case "calculatePowerConsumption":
                    response.put("status", "success");
                    response.put("data", technic.calculatePowerConsumption());
                    break;
                case "switchDevice":
                    technic.setEnabled(!technic.isEnabled());
                    technicService.update(technic);
                    response.put("status", "success");
                    response.put("message", "Устройство " + (technic.isEnabled() ? "включено" : "выключено"));
                    response.put("enabled", technic.isEnabled());
                    break;
                default:
                    try {
                        Method method = technic.getClass().getMethod(methodName);
                        Object result = method.invoke(technic);
                        response.put("status", "success");
                        if (result != null) response.put("data", result);
                    } catch (NoSuchMethodException e) {
                        response.put("status", "error");
                        response.put("message", "Неизвестный метод: " + methodName);
                        return ResponseEntity.badRequest().body(response);
                    }
                    break;
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}