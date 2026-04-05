package com.banquito.cliente.controller;

import com.banquito.cliente.dto.SolicitudRequestDTO;
import com.banquito.cliente.dto.SolicitudResponseDTO;
import com.banquito.cliente.service.SolicitudCreditoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/solicitudes")
@RequiredArgsConstructor
public class SolicitudCreditoController {

    private final SolicitudCreditoService service;

    @PostMapping
    public ResponseEntity<SolicitudResponseDTO> crear(@RequestBody SolicitudRequestDTO req) {
        return ResponseEntity.ok(service.crear(req));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<SolicitudResponseDTO>> porCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(service.porCliente(idCliente));
    }
}
