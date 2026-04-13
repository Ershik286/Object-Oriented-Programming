package org.example.WebAPI.Controllers;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.*;
import org.example.WebAPI.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smartfon")
public class SmartfonController {

    @Autowired
    private TechnicService technicService;

    // GET all smartfons
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSmartfons() {
        try {
            List<Map<String, Object>> smartfons = technicService.getSmartfonList();
            return ResponseEntity.ok(smartfons);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET smartfon by id
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ КОНСТРУКТОР 1: ПО УМОЛЧАНИЮ ============
    @PostMapping("/default")
    public ResponseEntity<Smartfon> createDefaultSmartfon() {
        try {
            Smartfon smartfon = new Smartfon();
            technicService.createSmartfon(smartfon);
            System.out.println("Создан смартфон через конструктор по умолчанию");
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ КОНСТРУКТОР 2: С КАМЕРОЙ ============
    @PostMapping("/create")
    public ResponseEntity<Smartfon> createSmartfon(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            int cameraMP = data.get("cameraMP") != null ? ((Number) data.get("cameraMP")).intValue() : 12;
            String manufactures = (String) data.getOrDefault("manufactures", "Samsung");
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;

            ComputerShop shop = shopId != null ? technicService.getShopById(shopId) : null;
            Smartfon smartfon = new Smartfon(name, cameraMP, manufactures, shop);

            technicService.createSmartfon(smartfon);
            System.out.println("Создан смартфон через конструктор с параметрами: " + name);
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ КОНСТРУКТОР 3: ПОЛНЫЙ ============
    @PostMapping("/create-full")
    public ResponseEntity<Smartfon> createSmartfonFull(@RequestBody Map<String, Object> data) {
        try {
            String name = (String) data.get("name");
            Long id = data.get("id") != null ? ((Number) data.get("id")).longValue() : null;
            String country = (String) data.getOrDefault("country", "China");
            boolean enabled = (boolean) data.getOrDefault("enabled", false);
            int cameraMP = data.get("cameraMP") != null ? ((Number) data.get("cameraMP")).intValue() : 1;
            boolean isCall = (boolean) data.getOrDefault("isCall", false);
            String manufactures = (String) data.getOrDefault("manufactures", "Huawei");
            Long shopId = data.get("shopId") != null ? ((Number) data.get("shopId")).longValue() : null;

            Smartfon smartfon = new Smartfon(name, country, enabled, cameraMP, isCall, manufactures,
                    shopId != null ? technicService.getShopById(shopId) : null);
            technicService.createSmartfon(smartfon);
            System.out.println("Создан смартфон через полный конструктор: " + name);
            return ResponseEntity.status(HttpStatus.CREATED).body(smartfon);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ ВЫЗОВ МЕТОДОВ ============
    @PostMapping("/{id}/call-method")
    public ResponseEntity<Map<String, Object>> callMethod(@PathVariable Long id, @RequestBody MethodInfo callMethod) {
        try {
            Smartfon smartfon = technicService.getSmartfonById(id);
            if (smartfon == null) {
                return ResponseEntity.notFound().build();
            }

            String output = "";
            switch (callMethod.getMethodName()) {
                case "displayInfo":
                    smartfon.displayInfo();
                    output = "displayInfo() выполнен";
                    break;
                case "calculatePowerConsumption":
                    double power = smartfon.calculatePowerConsumption();
                    output = "calculatePowerConsumption() = " + power + " Вт";
                    break;
                case "takePhoto":
                    smartfon.takePhoto();
                    output = "takePhoto() выполнен, фото сделано камерой " + smartfon.getCameraMP() + "МП";
                    break;
                case "call":
                    smartfon.call();
                    technicService.update(smartfon);
                    output = "call() выполнен, звонок начат";
                    break;
                case "reset":
                    smartfon.reset();
                    technicService.update(smartfon);
                    output = "reset() выполнен, звонок сброшен";
                    break;
                default:
                    output = "Метод " + callMethod.getMethodName() + " выполнен";
            }

            Map<String, Object> response = Map.of(
                    "status", "success",
                    "message", output,
                    "methodName", callMethod.getMethodName()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ УДАЛЕНИЕ ============
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSmartfon(@PathVariable Long id) {
        try {
            Smartfon existing = technicService.getSmartfonById(id);
            if (existing != null) {
                technicService.delete(id);
                System.out.println("Удален смартфон с ID: " + id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}