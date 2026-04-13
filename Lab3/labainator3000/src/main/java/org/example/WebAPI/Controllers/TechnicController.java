package org.example.WebAPI.Controllers;

import org.example.AppDataAPI.TechnicService;
import org.example.Class.Technic;
import org.example.WebAPI.MethodInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technic")
public class TechnicController {

    @Autowired
    private TechnicService technicService;

    // GET all
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        try {
            List<Map<String, Object>> technics = technicService.getAllTechnicsWithShop();
            System.out.println("Возвращено " + technics.size() + " записей");
            return ResponseEntity.ok(technics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<Technic> getById(@PathVariable Long id) {
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

    // POST create
    @PostMapping
    public ResponseEntity<Technic> create(@RequestBody Technic technic) {
        try {
            technicService.create(technic);
            System.out.println("Создана техника: " + technic.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(technic);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Technic> update(@PathVariable Long id, @RequestBody Technic technic) {
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

    // DELETE by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
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

    // GET count
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        try {
            long count = technicService.getCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET by country
    @GetMapping("/country/{country}")
    public ResponseEntity<List<Technic>> getByCountry(@PathVariable String country) {
        try {
            List<Technic> technics = technicService.getByRawSql(country);
            return ResponseEntity.ok(technics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/call_method")
    public ResponseEntity<Map<String, Object>> callMethod(@PathVariable Long id, @RequestBody MethodInfo callMethod) {
        try {
            // Логика вызова метода
            Map<String, Object> response = Map.of(
                    "status", "success",
                    "message", "Метод " + callMethod.getMethodName() + " вызван для техники с ID " + id,
                    "methodInfo", callMethod
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}