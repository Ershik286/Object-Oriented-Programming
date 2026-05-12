package org.example.WebAPI.Controllers;

import java.util.*;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@Transactional
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private TechnicService technicService;

    // ============ МЕТОДЫ ДЛЯ РАБОТЫ С МАГАЗИНАМИ ============

    // GET all shops
    @GetMapping("/all")
    public ResponseEntity<List<ComputerShop>> getAllShops() {
        try {
            List<ComputerShop> shops = technicService.getComputerShopRepository().findAll();
            System.out.println("Возвращено магазинов: " + shops.size());
            return ResponseEntity.ok(shops);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET shop by id
    @GetMapping("/{id}")
    public ResponseEntity<ComputerShop> getShopById(@PathVariable Long id) {
        try {
            ComputerShop shop = technicService.getComputerShopRepository().findById(id).orElse(null);
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
            ComputerShop shop = new ComputerShop(name);
            technicService.getComputerShopRepository().save(shop);
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
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        try {
            ComputerShop shop = technicService.getComputerShopRepository().findById(id).orElse(null);
            if (shop != null) {
                technicService.getComputerShopRepository().deleteById(id);
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

    // GET technics in specific shop WITH DETAILS
    @GetMapping("/{shopId}/technics")
    public ResponseEntity<List<Map<String, Object>>> getShopTechnics(@PathVariable Long shopId) {
        try {
            ComputerShop shop = technicService.getComputerShopRepository().findById(shopId).orElse(null);
            if (shop != null) {
                List<Map<String, Object>> result = shop.getSaleTechnicWithDetails();
                System.out.println("Возвращено техники из магазина " + shopId + ": " + result.size());
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.ok(new ArrayList<>());
            }
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
}