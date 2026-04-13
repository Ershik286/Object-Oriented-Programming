package org.example.AppDataAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import jakarta.persistence.Query;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import org.example.Class.*;

@Service
@Transactional
public class TechnicService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ComputerShopRepository computerShopRepository;

    @Autowired
    private TechnicRepository technicRepository;

    @Autowired
    private ComputerRepository computerRepository;

    @Autowired
    private SmartfonRepository smartfonRepository;

    // Обновление техники
    public void update(Technic technic) {
        entityManager.merge(technic);
        entityManager.flush();
    }

    public List<ComputerShop> getAllShops() {
        return computerShopRepository.findAll();
    }

    public ComputerShop getShopById(Long id) {
        return computerShopRepository.findById(id).orElse(null);
    }

    public ComputerShop createShop(String name) {
        ComputerShop shop = new ComputerShop(name);
        return computerShopRepository.save(shop);
    }

    public ComputerShop updateShop(Long id, String name) {
        ComputerShop shop = computerShopRepository.findById(id).orElse(null);
        if (shop != null) {
            shop.setName(name);
            return computerShopRepository.save(shop);
        }
        return null;
    }

    public void deleteShop(Long id) {
        computerShopRepository.deleteById(id);
    }

    public List<Technic> getShopTechnics(Long shopId) {
        ComputerShop shop = computerShopRepository.findById(shopId).orElse(null);
        return shop != null ? shop.getSaleTechnic() : new ArrayList<>();
    }

    public Computer getComputerById(Long id) {
        Technic technic = entityManager.find(Technic.class, id);
        return (technic instanceof Computer) ? (Computer) technic : null;
    }

    // Получить Smartfon по ID
    public Smartfon getSmartfonById(Long id) {
        Technic technic = entityManager.find(Technic.class, id);
        return (technic instanceof Smartfon) ? (Smartfon) technic : null;
    }

    public void addExistingTechnicToShop(Long shopId, Long technicId) {
        ComputerShop shop = computerShopRepository.findById(shopId).orElse(null);
        Technic technic = technicRepository.findById(technicId).orElse(null);

        if (shop != null && technic != null) {
            shop.addTechnic(technic);
            computerShopRepository.save(shop);
        }
    }

    public void removeTechnicFromShop(Long shopId, Long technicId) {
        ComputerShop shop = computerShopRepository.findById(shopId).orElse(null);
        if (shop != null) {
            shop.removeTechnicById(technicId);
            computerShopRepository.save(shop);
        }
    }

    // Удаление по ID
    public void delete(Long id) {
        Technic technic = entityManager.find(Technic.class, id);
        if (technic != null) {
            entityManager.remove(technic);
            entityManager.flush();
        }
    }

    // Получить количество
    public long getCount() {
        Query query = entityManager.createQuery("SELECT COUNT(t) FROM Technic t");
        return (long) query.getSingleResult();
    }

    // Получить все
    public List<Technic> getAll() {
        return entityManager.createQuery("SELECT t FROM Technic t", Technic.class)
                .getResultList();
    }

    // Получить по ID
    public Technic getById(Long id) {
        return entityManager.find(Technic.class, id);
    }

    // Создать технику
    public void create(Technic technic) {
        if (technic.getId() != null && technic.getId() == 0) {
            technic.setId(null);
        }
        entityManager.persist(technic);
        entityManager.flush();
    }

    // Создать компьютер
    public void createComputer(Computer computer) {
        System.out.println("=== Creating Computer ===");
        System.out.println("Name: " + computer.getName());
        System.out.println("Model Processor: " + computer.getModelProcessor());
        System.out.println("RAM: " + computer.getRam());
        System.out.println("Country: " + computer.getCountry());
        System.out.println("Enabled: " + computer.isEnabled());

        // ВАЖНО: Убеждаемся, что ID = null (а не 0) для нового объекта
        if (computer.getId() != null && computer.getId() == 0) {
            computer.setId(null);
        }

        // Используем persist для нового объекта
        entityManager.persist(computer);
        entityManager.flush();

        System.out.println("Computer created with ID: " + computer.getId());
    }

    // Создать смартфон
    public void createSmartfon(Smartfon smartfon) {
        System.out.println("CreateSmartfon: " + smartfon.getName() + ", " + smartfon.getManufactures());

        entityManager.persist(smartfon);
        entityManager.flush();

        System.out.println("Created with ID: " + smartfon.getId());
    }

    // Получить компьютеры с деталями
    public List<Map<String, Object>> getComputersWithDetails() {
        List<Computer> computers = computerRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Computer computer : computers) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", computer.getId());
            item.put("modelProcessor", computer.getModelProcessor());
            item.put("ram", computer.getRam());
            item.put("technicName", computer.getName());
            item.put("technicCountry", computer.getCountry());

            ComputerShop shop = computer.getShop();
            if (shop != null) {
                item.put("shopId", shop.getId());
                item.put("shopName", shop.getName());
            } else {
                item.put("shopId", null);
                item.put("shopName", null);
            }

            result.add(item);
        }
        return result;
    }

    // Получить список смартфонов
    public List<Map<String, Object>> getSmartfonList() {
        List<Smartfon> smartfons = smartfonRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Smartfon smartfon : smartfons) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", smartfon.getId());
            item.put("cameraMP", smartfon.getCameraMP());
            item.put("manufactures", smartfon.getManufactures());
            item.put("isCall", smartfon.isCall());
            item.put("technicName", smartfon.getName());
            item.put("technicCountry", smartfon.getCountry());

            ComputerShop shop = smartfon.getShop();
            if (shop != null) {
                item.put("shopId", shop.getId());
                item.put("shopName", shop.getName());
            } else {
                item.put("shopId", null);
                item.put("shopName", null);
            }

            result.add(item);
        }
        return result;
    }

    // Получить все техники с информацией о магазине
    public List<Map<String, Object>> getAllTechnicsWithShop() {
        List<Technic> technics = getAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Technic technic : technics) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", technic.getId());
            item.put("name", technic.getName());
            item.put("country", technic.getCountry());
            item.put("enabled", technic.isEnabled());

            ComputerShop shop = technic.getShop();
            if (shop != null) {
                item.put("shopId", shop.getId());
                item.put("shopName", shop.getName());
            } else {
                item.put("shopId", null);
                item.put("shopName", null);
            }

            result.add(item);
        }
        return result;
    }

    // Получить по SQL запросу
    @SuppressWarnings("unchecked")
    public List<Technic> getByRawSql(String country) {
        Query query = entityManager.createNativeQuery(
                "SELECT * FROM technic WHERE country = :country",
                Technic.class
        );
        query.setParameter("country", country);
        return query.getResultList();
    }
}