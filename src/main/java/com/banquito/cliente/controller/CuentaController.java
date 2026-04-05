package com.banquito.cliente.controller;

import com.banquito.cliente.dto.CuentaRequestDTO;
import com.banquito.cliente.dto.CuentaResponseDTO;
import com.banquito.cliente.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cuentas")
@RequiredArgsConstructor
public class CuentaController {

    private final CuentaService cuentaService;

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<CuentaResponseDTO>> listarPorCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(cuentaService.listarPorCliente(idCliente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuentaResponseDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(cuentaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CuentaResponseDTO> crearCuenta(@Valid @RequestBody CuentaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cuentaService.crearCuenta(dto));
    }
}
