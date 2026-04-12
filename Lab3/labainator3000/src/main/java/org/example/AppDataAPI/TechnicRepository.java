package org.example.AppDataAPI;

import org.example.Class.Technic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TechnicRepository extends JpaRepository<Technic, Long> {
    List<Technic> findByCountry(String country);
    List<Technic> findByEnabled(boolean enabled);
}