package org.example.Class;

import jakarta.persistence.*;

@Entity
@Table(name = "computer")
@PrimaryKeyJoinColumn(name = "technic_id")
public class Computer extends Technic {

    @Column(name = "model_processor", length = 100)
    private String modelProcessor;

    @Column(name = "ram")
    private int ram;

    // Конструкторы - НИКОГДА не устанавливаем ID
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

    public void enabledDevice() {
        setEnabled(true);
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Модель процессора: " + modelProcessor);
        System.out.println("Объем ОЗУ: " + ram + " ГБ");
    }

    @Override
    public double calculatePowerConsumption() {
        return isEnabled() ? 200 : 10;
    }
}