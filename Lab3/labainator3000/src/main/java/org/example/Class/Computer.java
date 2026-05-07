package org.example.Class;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Map;

@Entity
@Table(name = "computer")
@PrimaryKeyJoinColumn(name = "technic_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@ToString(callSuper = true)
public class Computer extends Technic {

    @Column(name = "model_processor", length = 100)
    private String modelProcessor;

    @Column(name = "ram")
    private int ram;

    // Конструкторы
    public Computer(String name, String modelProcessor, int ram, ComputerShop shop) {
        super(name, shop);
        this.modelProcessor = modelProcessor;
        this.ram = ram;
        this.setCountry("China");
        this.setEnabled(false);
    }

    public Computer(String name, String country, boolean enabled, String modelProcessor, int ram, ComputerShop shop) {
        super(name, country, enabled, shop);
        this.modelProcessor = modelProcessor;
        this.ram = ram;
    }

    // Бизнес-методы
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