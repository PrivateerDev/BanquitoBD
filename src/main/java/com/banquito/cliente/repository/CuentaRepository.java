package com.banquito.cliente.repository;

import com.banquito.cliente.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Integer> {
    List<Cuenta> findByClienteIdCliente(Integer idCliente);
    Optional<Cuenta> findByClabe(String clabe);
    boolean existsByClabe(String clabe);
    boolean existsByNumeroCuenta(String numeroCuenta);
}
