package org.example.AppDataAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
        getEntityManager().merge(technic);
        getEntityManager().flush();
    }

    public List<ComputerShop> getAllShops() {
        return getComputerShopRepository().findAll();
    }

    public ComputerShop getShopById(Long id) {
        return getComputerShopRepository().findById(id).orElse(null);
    }

    public ComputerShop createShop(String name) {
        ComputerShop shop = new ComputerShop(name);
        return getComputerShopRepository().save(shop);
    }

    public ComputerShop updateShop(Long id, String name) {
        ComputerShop shop = getComputerShopRepository().findById(id).orElse(null);
        if (shop != null) {
            shop.setName(name);
            return getComputerShopRepository().save(shop);
        }
        return null;
    }

    public void deleteShop(Long id) {
        getComputerShopRepository().deleteById(id);
    }

    public List<Technic> getShopTechnics(Long shopId) {
        ComputerShop shop = getComputerShopRepository().findById(shopId).orElse(null);
        return shop != null ? shop.getSaleTechnic() : new ArrayList<>();
    }

    public Computer getComputerById(Long id) {
        Technic technic = getEntityManager().find(Technic.class, id);
        return (technic instanceof Computer) ? (Computer) technic : null;
    }

    // Получить Smartfon по ID
    public Smartfon getSmartfonById(Long id) {
        Technic technic = getEntityManager().find(Technic.class, id);
        return (technic instanceof Smartfon) ? (Smartfon) technic : null;
    }

    public void addExistingTechnicToShop(Long shopId, Long technicId) {
        ComputerShop shop = getComputerShopRepository().findById(shopId).orElse(null);
        Technic technic = getTechnicRepository().findById(technicId).orElse(null);

        if (shop != null && technic != null) {
            shop.addTechnic(technic);
            getComputerShopRepository().save(shop);
        }
    }

    public void removeTechnicFromShop(Long shopId, Long technicId) {
        ComputerShop shop = getComputerShopRepository().findById(shopId).orElse(null);
        if (shop != null) {
            shop.removeTechnicById(technicId);
            getComputerShopRepository().save(shop);
        }
    }

    // Удаление по ID
    public void delete(Long id) {
        Technic technic = getEntityManager().find(Technic.class, id);
        if (technic != null) {
            getEntityManager().remove(technic);
            getEntityManager().flush();
        }
    }

    // Получить количество
//    public long getCount() {
//        Query query = getEntityManager().createQuery("SELECT COUNT(t) FROM Technic t");
//        return (long) query.getSingleResult();
//    }
//
//    // Получить все
//    public List<Technic> getAll() {
//        return getEntityManager().createQuery("SELECT t FROM Technic t", Technic.class)
//                .getResultList();
//    }
//
//    // Получить по ID
//    public Technic getById(Long id) {
//        return getEntityManager().find(Technic.class, id);
//    }

    // Создать технику
    public void create(Technic technic) {
        if (technic.getId() != null && technic.getId() == 0) {
            technic.setId(null);
        }
        getEntityManager().persist(technic);
        getEntityManager().flush();
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
        getEntityManager().persist(computer);
        getEntityManager().flush();

        System.out.println("Computer created with ID: " + computer.getId());
    }

    // Создать смартфон
    public void createSmartfon(Smartfon smartfon) {
        System.out.println("CreateSmartfon: " + smartfon.getName() + ", " + smartfon.getManufactures());

        getEntityManager().persist(smartfon);
        getEntityManager().flush();

        System.out.println("Created with ID: " + smartfon.getId());
    }

    // Получить компьютеры с деталями
    public List<Map<String, Object>> getComputersWithDetails() {
        List<Computer> computers = getComputerRepository().findAll();
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

    public List<Map<String, Object>> getSmartfonList() {
        List<Smartfon> smartfons = smartfonRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        System.out.println("DEBUG: Найдено смартфонов в репозитории: " + smartfons.size());

        for (Smartfon smartfon : smartfons) {
            System.out.println("DEBUG: Обработка смартфона: " + smartfon.getName());

            Map<String, Object> item = new HashMap<>();
            item.put("id", smartfon.getId());
            item.put("cameraMP", smartfon.getCameraMP());
            item.put("manufactures", smartfon.getManufactures());
            item.put("isCall", smartfon.isCall());
            item.put("technicName", smartfon.getName());
            item.put("technicCountry", smartfon.getCountry());
            item.put("enabled", smartfon.isEnabled());

            // Безопасная проверка shop
            ComputerShop shop = null;
            try {
                shop = smartfon.getShop();
            } catch (Exception e) {
                System.out.println("DEBUG: Не удалось получить shop: " + e.getMessage());
            }

            if (shop != null) {
                item.put("shopId", shop.getId());
                item.put("shopName", shop.getName());
            } else {
                item.put("shopId", null);
                item.put("shopName", null);
            }

            result.add(item);
        }

        System.out.println("DEBUG: Результат: " + result.size());
        return result;
    }

    // Получить все техники с информацией о магазине
    public List<Map<String, Object>> getAllTechnicsWithShop() {
        List<Technic> technics = technicRepository.findAll();
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

    public EntityManager getEntityManager() {
        return entityManager;
    }

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public ComputerShopRepository getComputerShopRepository() {
        return computerShopRepository;
    }

    public void setComputerShopRepository(ComputerShopRepository computerShopRepository) {
        this.computerShopRepository = computerShopRepository;
    }

    public TechnicRepository getTechnicRepository() {
        return technicRepository;
    }

    public void setTechnicRepository(TechnicRepository technicRepository) {
        this.technicRepository = technicRepository;
    }

    public ComputerRepository getComputerRepository() {
        return computerRepository;
    }

    public void setComputerRepository(ComputerRepository computerRepository) {
        this.computerRepository = computerRepository;
    }

    public SmartfonRepository getSmartfonRepository() {
        return smartfonRepository;
    }

    public void setSmartfonRepository(SmartfonRepository smartfonRepository) {
        this.smartfonRepository = smartfonRepository;
    }
}