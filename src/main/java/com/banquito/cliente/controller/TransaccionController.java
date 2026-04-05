package com.banquito.cliente.controller;

import com.banquito.cliente.dto.TransaccionRequestDTO;
import com.banquito.cliente.dto.TransaccionResponseDTO;
import com.banquito.cliente.service.TransaccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService transaccionService;

    @GetMapping("/cuenta/{idCuenta}")
    public ResponseEntity<List<TransaccionResponseDTO>> listarPorCuenta(@PathVariable Integer idCuenta) {
        return ResponseEntity.ok(transaccionService.listarPorCuenta(idCuenta));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<TransaccionResponseDTO>> listarPorCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(transaccionService.listarPorCliente(idCliente));
    }

    @PostMapping("/spei")
    public ResponseEntity<TransaccionResponseDTO> realizarTransferencia(@Valid @RequestBody TransaccionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transaccionService.realizarTransferencia(dto));
    }

    /**
     * RF-CLI-08 / RNF-CLI-08 — Lista transacciones sospechosas.
     * Acceso: solo SUPERVISOR (validado en SecurityConfig + frontend).
     * Usa idx_tx_sospechosa (V6__indices_rendimiento.sql).
     */
    @GetMapping("/sospechosas")
    public ResponseEntity<List<TransaccionResponseDTO>> listarSospechosas() {
        return ResponseEntity.ok(transaccionService.listarSospechosas());
    }

    /**
     * RNF-CLI-08 — Marca una transacción sospechosa como revisada.
     * Registra el email del supervisor autenticado en el log de auditoría.
     */
    @PatchMapping("/{id}/revisar")
    public ResponseEntity<TransaccionResponseDTO> marcarRevisada(
            @PathVariable Integer id,
            Authentication auth) {
        String supervisorEmail = auth != null ? auth.getName() : "desconocido";
        return ResponseEntity.ok(transaccionService.marcarRevisada(id, supervisorEmail));
    }
}
