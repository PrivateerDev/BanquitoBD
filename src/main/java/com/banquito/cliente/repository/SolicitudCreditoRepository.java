package com.banquito.cliente.repository;

import com.banquito.cliente.model.SolicitudCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudCreditoRepository extends JpaRepository<SolicitudCredito, Integer> {
    List<SolicitudCredito> findByIdclienteOrderByCreatedatDesc(Integer idCliente);
}
