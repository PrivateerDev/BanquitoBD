package com.banquito.cliente.controller;

import com.banquito.cliente.dto.MovimientoCuentaDTO;
import com.banquito.cliente.dto.ProductoClienteDTO;
import com.banquito.cliente.service.ProductoMovimientoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints de productos y movimientos para uso del Empleado de Sucursal.
 *
 * Trazabilidad:
 *  RF-CLI-01  → GET /api/v1/clientes/{id}/productos
 *  RF-CLI-02  → GET /api/v1/cuentas/{idCuenta}/movimientos
 *  RF-CLI-03  → incluido en /productos (solicitudes)
 *  RNF-CLI-02 → respuesta < 5 s (garantizado por índices en BD)
 *
 * Actor: EJECUTIVO_SUCURSAL (Ejecutivo de Cuenta — Atención a Clientes)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductoMovimientoController {

    private final ProductoMovimientoService service;

    // ──────────────────────────────────────────────────────────────────────────
    // RF-CLI-01 + RF-CLI-03 — Productos activos y finalizados del cliente
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Devuelve cuentas (activas/canceladas) y solicitudes (activas/resueltas).
     * Trazabilidad: RF-CLI-01, RF-CLI-03 · CU-CLI-01 · tbl_cuenta + tbl_solicitud_credito
     *
     * GET /api/v1/clientes/{idCliente}/productos
     */
    @GetMapping("/clientes/{idCliente}/productos")
    public ResponseEntity<ProductoClienteDTO> obtenerProductos(@PathVariable Integer idCliente) {
        log.info("[RF-CLI-01][RF-CLI-03] GET /clientes/{}/productos", idCliente);
        ProductoClienteDTO resultado = service.obtenerProductosCliente(idCliente);
        return ResponseEntity.ok(resultado);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // RF-CLI-02 + RF-CLI-08 — Movimientos de cuenta específica
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Historial de movimientos de una cuenta.
     * Trazabilidad: RF-CLI-02, RF-CLI-08 · RNF-CLI-02 (<5s) · tbl_transaccion
     *
     * GET /api/v1/cuentas/{idCuenta}/movimientos
     */
    @GetMapping("/cuentas/{idCuenta}/movimientos")
    public ResponseEntity<MovimientoCuentaDTO> obtenerMovimientos(@PathVariable Integer idCuenta) {
        log.info("[RF-CLI-02] GET /cuentas/{}/movimientos", idCuenta);
        MovimientoCuentaDTO resultado = service.obtenerMovimientosCuenta(idCuenta);
        return ResponseEntity.ok(resultado);
    }

    /**
     * Movimientos de TODAS las cuentas de un cliente (vista consolidada).
     * Trazabilidad: RF-CLI-01, RF-CLI-02 · CU-CLI-01
     *
     * GET /api/v1/clientes/{idCliente}/movimientos
     */
    @GetMapping("/clientes/{idCliente}/movimientos")
    public ResponseEntity<List<MovimientoCuentaDTO>> obtenerMovimientosCliente(
            @PathVariable Integer idCliente) {
        log.info("[RF-CLI-01][RF-CLI-02] GET /clientes/{}/movimientos", idCliente);
        List<MovimientoCuentaDTO> resultado = service.obtenerMovimientosTodoCuenta(idCliente);
        return ResponseEntity.ok(resultado);
    }
}
