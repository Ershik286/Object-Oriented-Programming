package org.example.Class;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.io.Serializable;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "technic")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class Technic implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
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
    @ToString.Exclude
    private ComputerShop shop;

    // Конструкторы без ID
    public Technic(String name, ComputerShop shop) {
        this.name = name;
        this.country = "China";
        this.enabled = false;
        this.shop = shop;
        if (shop == null) {
            System.out.println("Не подан объект магазина");
        }
    }

    public Technic(String name, String country, boolean enabled, ComputerShop shop) {
        this.name = name;
        this.country = country;
        this.enabled = enabled;
        this.shop = shop;
        if (shop == null) {
            System.out.println("Не подан объект магазина");
        }
    }

    public void switchDevice() {
        setEnabled(!isEnabled());
    }

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
}