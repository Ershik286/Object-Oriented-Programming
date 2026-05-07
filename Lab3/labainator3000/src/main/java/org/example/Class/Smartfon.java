package org.example.Class;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.io.Serializable;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "smartfon")
@PrimaryKeyJoinColumn(name = "technic_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@ToString(callSuper = true)
public class Smartfon extends Technic implements Serializable {

    @Column(name = "camera_mp")
    private int cameraMP;

    @Column(name = "is_call")
    private boolean isCall = false;

    @Column(name = "manufactures", length = 100)
    private String manufactures;

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

    // Бизнес-методы
    public void takePhoto() {
        System.out.println("Сделано фото качеством " + cameraMP + " мегапикселей");
    }

    public void call() {
        this.isCall = true;
    }

    public void reset() {
        this.isCall = false;
    }

    @Override
    public Map<String, Object> displayInfo() {
        Map<String, Object> result = super.displayInfo();
        result.put("cameraMP", cameraMP);
        result.put("isCall", isCall ? "звонит" : "не звонит");
        result.put("manufacture", manufactures);
        result.put("type", "Smartfon");
        return result;
    }

    @Override
    public double calculatePowerConsumption() {
        return isEnabled() ? 5 : 0.5;
    }
}