package com.banquito.cliente.repository;

import com.banquito.cliente.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByRfc(String rfc);
    boolean existsByEmail(String email);
    boolean existsByRfc(String rfc);
    boolean existsByCurp(String curp);
}
