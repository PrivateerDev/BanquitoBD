package com.banquito.cliente.controller;

import com.banquito.cliente.dto.BloqueoTarjetaRequestDTO;
import com.banquito.cliente.dto.BloqueoTarjetaResponseDTO;
import com.banquito.cliente.service.BloqueoTarjetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bloqueos")
@RequiredArgsConstructor
public class BloqueoTarjetaController {

    private final BloqueoTarjetaService bloqueoTarjetaService;

    @PostMapping
    public ResponseEntity<BloqueoTarjetaResponseDTO> bloquearTarjeta(
            @RequestBody BloqueoTarjetaRequestDTO request) {
        return ResponseEntity.ok(bloqueoTarjetaService.bloquearTarjeta(request));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<BloqueoTarjetaResponseDTO>> obtenerPorCliente(
            @PathVariable Integer idCliente) {
        return ResponseEntity.ok(bloqueoTarjetaService.obtenerPorCliente(idCliente));
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<BloqueoTarjetaResponseDTO> obtenerPorFolio(
            @PathVariable String folio) {
        return ResponseEntity.ok(bloqueoTarjetaService.obtenerPorFolio(folio));
    }
}
