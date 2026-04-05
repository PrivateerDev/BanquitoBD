package com.banquito.cliente.repository;

import com.banquito.cliente.model.BloqueoTarjeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloqueoTarjetaRepository extends JpaRepository<BloqueoTarjeta, Integer> {
    Optional<BloqueoTarjeta> findByFolio(String folio);
    List<BloqueoTarjeta> findByCliente_IdCliente(Integer idCliente);
    boolean existsByTarjeta_IdTarjeta(Integer idTarjeta);
}
