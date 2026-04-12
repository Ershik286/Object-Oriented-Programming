package org.example.Class;

import java.util.*;
import jakarta.persistence.*;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "shop")
public class ComputerShop implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name = "SND";

    // Изменил FetchType на EAGER, чтобы техника загружалась сразу
    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Technic> saleTechnic = new ArrayList<>();

    public ComputerShop() {
        System.out.println("Создан объект магазина");
    }

    public ComputerShop(String name) {
        this.name = name;
        System.out.println("Создан объект магазина: " + name);
    }

    public ComputerShop(List<Technic> technics, String name) {
        this.saleTechnic = technics;
        this.name = name;
        // Устанавливаем связь в обратную сторону
        for (Technic technic : technics) {
            technic.setShop(this);
        }
        System.out.println("Создан объект магазина: " + name);
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Technic> getSaleTechnic() {
        return saleTechnic;
    }

    public void setSaleTechnic(List<Technic> saleTechnic) {
        this.saleTechnic = saleTechnic;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Методы управления техникой
    public void addTechnic(Technic technic) {
        saleTechnic.add(technic);
        technic.setShop(this);
    }

    public void removeTechnicById(int index) {
        if (index >= 0 && index < saleTechnic.size()) {
            Technic technic = saleTechnic.get(index);
            technic.setShop(null);
            saleTechnic.remove(index);
        }
    }

    public void removeTechnic(Technic technic) {
        technic.setShop(null);
        saleTechnic.remove(technic);
    }

    public void removeTechnicById(Long id) {
        saleTechnic.removeIf(technic -> technic.getId().equals(id));
    }

    // Дополнительный метод для получения техники с деталями (без циклических ссылок)
    public List<Map<String, Object>> getSaleTechnicWithDetails() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Technic technic : saleTechnic) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", technic.getId());
            item.put("name", technic.getName());
            item.put("country", technic.getCountry());
            item.put("enabled", technic.isEnabled());

            if (technic instanceof Computer) {
                Computer comp = (Computer) technic;
                item.put("type", "computer");
                item.put("modelProcessor", comp.getModelProcessor());
                item.put("ram", comp.getRam());
            } else if (technic instanceof Smartfon) {
                Smartfon sf = (Smartfon) technic;
                item.put("type", "smartfon");
                item.put("cameraMP", sf.getCameraMP());
                item.put("manufactures", sf.getManufactures());
                item.put("isCall", sf.isCall());
            }
            result.add(item);
        }
        return result;
    }

    @Override
    public String toString() {
        return "ComputerShop{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", technicsCount=" + saleTechnic.size() +
                '}';
    }
}