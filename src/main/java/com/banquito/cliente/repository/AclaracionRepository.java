package com.banquito.cliente.repository;

import com.banquito.cliente.model.Aclaracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AclaracionRepository extends JpaRepository<Aclaracion, Integer> {
    List<Aclaracion> findByCliente_IdClienteOrderByCreatedAtDesc(Integer idCliente);
    Optional<Aclaracion> findByFolio(String folio);
}
