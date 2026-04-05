package com.banquito.cliente.controller;

import com.banquito.cliente.repository.TarjetaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tarjetas")
@RequiredArgsConstructor
public class TarjetaController {

    private final TarjetaRepository tarjetaRepository;

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Map<String, Object>>> getTarjetasPorCliente(@PathVariable Integer idCliente) {
        List<Map<String, Object>> result = tarjetaRepository
            .findByCliente_IdClienteAndEstado(idCliente, "ACTIVA")
            .stream()
            .map(t -> Map.<String, Object>of(
                "idTarjeta", t.getIdTarjeta(),
                "numeroTarjeta", t.getNumeroTarjeta(),
                "tipoTarjeta", t.getTipoTarjeta(),
                "fechaVenc", t.getFechaVenc().toString(),
                "saldoDisponible", t.getSaldoDisponible(),
                "estado", t.getEstado()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
