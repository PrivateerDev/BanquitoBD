package com.banquito.cliente.repository;

import com.banquito.cliente.model.Tarjeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarjetaRepository extends JpaRepository<Tarjeta, Integer> {
    Optional<Tarjeta> findByNumeroTarjeta(String numeroTarjeta);
    List<Tarjeta> findByCliente_IdClienteAndEstado(Integer idCliente, String estado);
}
