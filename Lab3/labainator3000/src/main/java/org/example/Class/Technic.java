package org.example.Class;

import jakarta.persistence.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "technic")
@Inheritance(strategy = InheritanceType.JOINED)
public class Technic implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "enabled")
    private boolean enabled;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @JsonBackReference
    private ComputerShop shop;

    // Геттеры
    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public String getCountry() {
        return country;
    }

    public boolean isEnabled() {
        return enabled;
    }

    // Сеттеры
    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    // Конструкторы - БЕЗ ID (генерируется автоматически)
    public Technic() {
        this.name = "Default Device";
        this.country = "China";
        this.enabled = false;
        this.shop = null;
        // ID остается null
    }

    public Technic(String name, ComputerShop shop) {
        this.name = name;
        this.country = "China";
        this.enabled = false;
        this.shop = shop;
        // ID остается null
        if (shop == null) {
            System.out.println("Не подан объект магазина");
        }
    }

    public Technic(String name, String country, boolean enabled, ComputerShop shop) {
        this.name = name;
        this.country = country;
        this.enabled = enabled;
        this.shop = shop;
        // ID остается null
        if (shop == null) {
            System.out.println("Не подан объект магазина");
        }
    }

    public void switchDevice() {
        setEnabled(isEnabled() ? false : true);
    }

    // Методы
    public Map<String, Object> displayInfo() {
        Map<String, Object> data = new HashMap<>();
        data.put("type", "Устройство");
        data.put("name", name);
        data.put("id", id);
        data.put("country", country);
        data.put("enabled", enabled);
        data.put("status", enabled ? "включен" : "Выключен");
        return data;
    }

    public double calculatePowerConsumption() {
        return 0;
    }

    public ComputerShop getShop() {
        return shop;
    }

    public void setShop(ComputerShop shop) {
        this.shop = shop;
    }
}