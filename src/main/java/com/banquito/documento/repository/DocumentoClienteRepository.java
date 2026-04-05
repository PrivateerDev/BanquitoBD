package com.banquito.documento.repository;

import com.banquito.documento.model.DocumentoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentoClienteRepository extends JpaRepository<DocumentoCliente, Integer> {
    List<DocumentoCliente> findByClienteIdClienteOrderByCreatedAtDesc(Integer idCliente);
    List<DocumentoCliente> findByEstadoOrderByCreatedAtDesc(String estado);
}
