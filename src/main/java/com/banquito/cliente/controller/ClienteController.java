package com.banquito.cliente.controller;

import com.banquito.cliente.dto.ClienteRequestDTO;
import com.banquito.cliente.dto.ClienteResponseDTO;
import com.banquito.cliente.dto.ClienteStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import com.banquito.cliente.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> listarClientes(
            @PageableDefault(size = 20, sort = "idCliente") Pageable pageable) {
        return ResponseEntity.ok(clienteService.listarClientes(pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<ClienteStatsDTO> obtenerStats() {
        return ResponseEntity.ok(clienteService.obtenerStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ClienteResponseDTO> buscarPorEmail(@PathVariable String email) {
        return ResponseEntity.ok(clienteService.buscarPorEmail(email));
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crearCliente(@Valid @RequestBody ClienteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crearCliente(dto));
    }
}
