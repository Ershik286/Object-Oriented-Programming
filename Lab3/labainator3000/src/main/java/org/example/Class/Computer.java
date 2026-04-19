package org.example.Class;

import jakarta.persistence.*;
import org.springframework.objenesis.ObjenesisHelper;

import java.util.*;

@Entity
@Table(name = "computer")
@PrimaryKeyJoinColumn(name = "technic_id")
public class Computer extends Technic {

    @Column(name = "model_processor", length = 100)
    private String modelProcessor;

    @Column(name = "ram")
    private int ram;

    public Computer() {
        super();
        this.modelProcessor = "Intel Core i5";
        this.ram = 8;
        this.setName("Default Computer");
        this.setCountry("China");
        this.setEnabled(false);
        // ID остается null
    }

    public Computer(String name, String modelProcessor, int ram, ComputerShop shop) {
        super(name, shop);
        this.modelProcessor = modelProcessor;
        this.ram = ram;
        this.setCountry("China");
        this.setEnabled(false);
        // ID остается null
    }

    public Computer(String name, String country, boolean enabled, String modelProcessor, int ram, ComputerShop shop) {
        super(name, country, enabled, shop);
        this.modelProcessor = modelProcessor;
        this.ram = ram;
        // ID остается null
    }

    // Геттеры и сеттеры
    public String getModelProcessor() {
        return modelProcessor;
    }

    public void setModelProcessor(String modelProcessor) {
        this.modelProcessor = modelProcessor;
    }

    public int getRam() {
        return ram;
    }

    public void setRam(int ram) {
        this.ram = ram;
    }

    public boolean upgradeProcessor(String newProcessor) {
        if (newProcessor == null || newProcessor.trim().isEmpty()) {
            System.out.println("Ошибка: название процессора не может быть пустым");
            return false;
        }

        String oldProcessor = this.modelProcessor;
        this.modelProcessor = newProcessor;
        System.out.println("Процессор обновлён с " + oldProcessor + " на " + newProcessor);
        return true;
    }

    public boolean changeRam(int additionalRam) {
        int newRam = this.ram + additionalRam;

        if (newRam < 1) {
            System.out.println("Ошибка: ОЗУ не может быть меньше 1 ГБ");
            return false;
        }

        if (newRam > 128) {
            System.out.println("Ошибка: ОЗУ не может превышать 128 ГБ");
            return false;
        }

        System.out.println("ОЗУ изменено с " + this.ram + " ГБ на " + newRam + " ГБ");
        this.ram = newRam;
        return true;
    }

    @Override
    public Map<String, Object> displayInfo() {
        Map<String, Object> result = super.displayInfo();
        result.put("modelProcessor", modelProcessor);
        result.put("ram", ram + " ГБ");
        result.put("type", "Computer");
        return result;
    }

    @Override
    public double calculatePowerConsumption() {
        return isEnabled() ? 200 : 10;
    }
}