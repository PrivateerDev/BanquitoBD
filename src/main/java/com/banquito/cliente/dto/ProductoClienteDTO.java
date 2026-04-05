package com.banquito.cliente.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO consolidado de productos del cliente.
 * Trazabilidad: RF-CLI-01 · CU-CLI-01 · Actor: Ejecutivo de Cuenta / EJECUTIVO_SUCURSAL
 * Cubre: tbl_cuenta, tbl_tarjeta, tbl_solicitud_credito
 */
@Data
@Builder
public class ProductoClienteDTO {

    // ── Cuentas bancarias ──────────────────────────────────────────────────────
    // RF-CLI-01: Consultar saldos y productos contratados
    private List<CuentaProductoDTO> cuentas;

    // ── Solicitudes de crédito / productos ────────────────────────────────────
    // RF-CLI-03: Solicitar productos bancarios; estados activos y finalizados
    private List<SolicitudProductoDTO> solicitudes;

    // ─────────────────────────────────────────────────────────────────────────
    @Data
    @Builder
    public static class CuentaProductoDTO {
        private Integer idCuenta;
        private String  numeroCuenta;
        private String  clabe;
        private String  tipoCuenta;        // AHORRO | CHEQUES | INVERSION
        private String  estado;            // ACTIVA | BLOQUEADA | CANCELADA  ← RF-CLI-05
        private BigDecimal saldo;
        private BigDecimal limiteDialio;
        private String  sucursalNombre;
        private LocalDateTime creadoEn;
        /** Indica si el producto está "activo" para el front. RF-CLI-01 */
        private boolean activo;
    }

    @Data
    @Builder
    public static class SolicitudProductoDTO {
        private Integer idSolicitud;
        private String  folioSeguimiento;
        private String  tipoProducto;      // CREDITO_PERSONAL | CREDITO_AUTOMOTRIZ | etc.
        private BigDecimal monto;
        private Integer plazo;
        private String  estado;            // PENDIENTE | APROBADA | RECHAZADA | CANCELADA
        private LocalDateTime creadoEn;
        private LocalDateTime actualizadoEn;
        /** Producto activo = estado PENDIENTE o APROBADA. RF-CLI-03 */
        private boolean activo;
    }
}
