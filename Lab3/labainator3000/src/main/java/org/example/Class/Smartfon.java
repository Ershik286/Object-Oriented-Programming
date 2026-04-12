package org.example.Class;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "smartfon")
@PrimaryKeyJoinColumn(name = "technic_id")
public class Smartfon extends Technic implements Serializable {

    @Column(name = "camera_mp")
    private int cameraMP;

    @Column(name = "is_call")
    private boolean isCall = false;

    @Column(name = "manufactures", length = 100)
    private String manufactures;

    // Конструкторы - БЕЗ ID
    public Smartfon() {
        super();
        this.cameraMP = 12;
        this.isCall = false;
        this.manufactures = "Samsung";
        this.setName("Default Smartphone");
        this.setCountry("Korea");
        this.setEnabled(false);
    }

    public Smartfon(String name, int cameraMP, String manufactures, ComputerShop shop) {
        super(name, shop);
        this.cameraMP = cameraMP;
        this.isCall = false;
        this.manufactures = manufactures;
        this.setCountry("Korea");
        this.setEnabled(false);
    }

    public Smartfon(String name, String country, boolean enabled, int cameraMP, boolean isCall, String manufactures, ComputerShop shop) {
        super(name, country, enabled, shop);
        this.cameraMP = cameraMP;
        this.isCall = isCall;
        this.manufactures = manufactures;
    }

    // Геттеры
    public int getCameraMP() {
        return cameraMP;
    }

    public String getManufactures() {
        return manufactures;
    }

    public boolean isCall() {
        return isCall;
    }

    // Сеттеры
    public void setCameraMP(int cameraMP) {
        this.cameraMP = cameraMP;
    }

    public void setManufactures(String manufactures) {
        this.manufactures = manufactures;
    }

    public void call() {
        this.isCall = true;
    }

    public void reset() {
        this.isCall = false;
    }

    // Методы
    public void takePhoto() {
        System.out.println("Сделано фото качеством " + cameraMP + " мегапикселей");
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Производитель телефона: " + manufactures);
        System.out.println("Мегапиксели телефона: " + cameraMP);
    }

    @Override
    public double calculatePowerConsumption() {
        return isEnabled() ? 5 : 0.5;
    }
}