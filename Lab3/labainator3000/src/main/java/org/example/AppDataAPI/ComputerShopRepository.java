package org.example.AppDataAPI;
import org.example.Class.ComputerShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComputerShopRepository extends JpaRepository<ComputerShop, Long> {
    List<ComputerShop> findByName(String name);
}