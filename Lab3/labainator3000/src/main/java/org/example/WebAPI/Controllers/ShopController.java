package org.example.WebAPI.Controllers;

import java.util.*;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private TechnicService technicService;

    // ============ МЕТОДЫ ДЛЯ РАБОТЫ С МАГАЗИНАМИ ============

    // GET all shops
    @GetMapping("/all")
    public ResponseEntity<List<ComputerShop>> getAllShops() {
        try {
            List<ComputerShop> shops = technicService.getAllShops();
            System.out.println("Возвращено магазинов: " + shops.size());
            return ResponseEntity.ok(shops);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET shop by id
    @GetMapping("/shop/{id}")
    public ResponseEntity<ComputerShop> getShopById(@PathVariable Long id) {
        try {
            ComputerShop shop = technicService.getShopById(id);
            if (shop != null) {
                System.out.println("Возвращен магазин: " + shop.getName());
                return ResponseEntity.ok(shop);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST create shop
    @PostMapping("/create")
    public ResponseEntity<ComputerShop> createShop(@RequestParam String name) {
        try {
            ComputerShop shop = technicService.createShop(name);
            System.out.println("Создан магазин: " + shop.getName() + " с ID: " + shop.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(shop);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT update shop
    @PutMapping("/{id}")
    public ResponseEntity<ComputerShop> updateShop(@PathVariable Long id, @RequestParam String name) {
        try {
            ComputerShop shop = technicService.updateShop(id, name);
            if (shop != null) {
                System.out.println("Обновлен магазин с ID: " + id + ", новое имя: " + name);
                return ResponseEntity.ok(shop);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE shop
    @DeleteMapping("/shop/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        try {
            ComputerShop shop = technicService.getShopById(id);
            if (shop != null) {
                technicService.deleteShop(id);
                System.out.println("Удален магазин с ID: " + id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET all technics in specific shop
    @GetMapping("/{shopId}/technics")
    public ResponseEntity<List<Technic>> getShopTechnics(@PathVariable Long shopId) {
        try {
            List<Technic> technics = technicService.getShopTechnics(shopId);
            System.out.println("Возвращено техники из магазина " + shopId + ": " + technics.size());
            return ResponseEntity.ok(technics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST add technic to shop
    @PostMapping("/{shopId}/add-technic/{technicId}")
    public ResponseEntity<Void> addTechnicToShop(@PathVariable Long shopId, @PathVariable Long technicId) {
        try {
            technicService.addExistingTechnicToShop(shopId, technicId);
            System.out.println("Техника " + technicId + " добавлена в магазин " + shopId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE remove technic from shop
    @DeleteMapping("/{shopId}/remove-technic/{technicId}")
    public ResponseEntity<Void> removeTechnicFromShop(@PathVariable Long shopId, @PathVariable Long technicId) {
        try {
            technicService.removeTechnicFromShop(shopId, technicId);
            System.out.println("Техника " + technicId + " удалена из магазина " + shopId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ============ СУЩЕСТВУЮЩИЕ МЕТОДЫ ДЛЯ ТЕХНИКИ ============

    // GET all technics in shop (все техники из всех магазинов)
    @GetMapping("/sale_technic")
    public ResponseEntity<List<Technic>> getAllSaleTechnic() {
        try {
            List<Technic> technics = technicService.getAll();
            System.out.println("Возврат всех данных из таблиц, найдено: " + technics.size());
            return ResponseEntity.ok(technics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET by id
    @GetMapping("/technic/{id}")
    public ResponseEntity<Technic> getTechnic(@PathVariable Long id) {
        try {
            Technic technic = technicService.getById(id);
            if (technic != null) {
                System.out.println("Возвращена техника с ID: " + id);
                return ResponseEntity.ok(technic);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE by id
    @DeleteMapping("/technic/{id}")
    public ResponseEntity<Void> deleteTechnic(@PathVariable Long id) {
        try {
            Technic existing = technicService.getById(id);
            if (existing != null) {
                technicService.delete(id);
                System.out.println("Удалена техника с ID: " + id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST create technic
    @PostMapping("/technic")
    public ResponseEntity<Technic> createTechnic(@RequestBody Technic technic) {
        try {
            technicService.create(technic);
            System.out.println("Создана техника: " + technic.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(technic);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT update technic
    @PutMapping("/technic/{id}")
    public ResponseEntity<Technic> updateTechnic(@PathVariable Long id, @RequestBody Technic technic) {
        try {
            Technic existing = technicService.getById(id);
            if (existing != null) {
                technic.setId(id);
                technicService.update(technic);
                System.out.println("Обновлена техника с ID: " + id);
                return ResponseEntity.ok(technic);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET computers with details
    @GetMapping("/computers")
    public ResponseEntity<List<Map<String, Object>>> getComputers() {
        try {
            List<Map<String, Object>> computers = technicService.getComputersWithDetails();
            return ResponseEntity.ok(computers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET smartphones with details
    @GetMapping("/smartfons")
    public ResponseEntity<List<Map<String, Object>>> getSmartfons() {
        try {
            List<Map<String, Object>> smartfons = technicService.getSmartfonList();
            return ResponseEntity.ok(smartfons);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}