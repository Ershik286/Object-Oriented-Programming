package org.example.AppDataAPI;

import org.example.Class.Computer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComputerRepository extends JpaRepository<Computer, Long> {
    List<Computer> findByModelProcessor(String modelProcessor);
    List<Computer> findByRamGreaterThan(int ram);
}