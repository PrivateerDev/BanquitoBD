package com.banquito.cliente.controller;

import com.banquito.cliente.dto.AclaracionRequestDTO;
import com.banquito.cliente.dto.AclaracionResponseDTO;
import com.banquito.cliente.service.AclaracionService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/aclaraciones")
@RequiredArgsConstructor
public class AclaracionController {

    private final AclaracionService aclaracionService;

    @PostMapping
    public ResponseEntity<AclaracionResponseDTO> crearAclaracion(@Valid @RequestBody AclaracionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aclaracionService.crearAclaracion(request));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<AclaracionResponseDTO>> obtenerPorCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(aclaracionService.obtenerPorCliente(idCliente));
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<AclaracionResponseDTO> obtenerPorFolio(@PathVariable String folio) {
        return ResponseEntity.ok(aclaracionService.obtenerPorFolio(folio));
    }
}
