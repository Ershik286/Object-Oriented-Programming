package org.example.AppDataAPI;

import org.example.Class.Smartfon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SmartfonRepository extends JpaRepository<Smartfon, Long> {
    List<Smartfon> findByManufactures(String manufactures);
    List<Smartfon> findByCameraMPGreaterThan(int cameraMP);
}