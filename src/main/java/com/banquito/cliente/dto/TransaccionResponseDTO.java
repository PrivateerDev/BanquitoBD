package com.banquito.cliente.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta de transacción.
 *
 * Trazabilidad: RF-CLI-02, RF-CLI-08, RNF-CLI-08
 *
 * UNIFICACIÓN (Ronda 2 de coherencia):
 *   - Se agrega 'tipoOperacion' como campo canónico (usado por MovimientosCuenta.jsx
 *     y ProductoMovimientoService).
 *   - 'tipoOp' se mantiene por compatibilidad con CuentasCliente.jsx existente.
 *   - Ambos devuelven el mismo valor — sin romper nada.
 *
 * Valores válidos (CHECK constraint V5):
 *   SPEI | DEPOSITO | RETIRO | PAGO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionResponseDTO {

    private Integer idTransaccion;

    /**
     * Campo canónico — usado por MovimientosCuenta.jsx (tab nuevo)
     * y ProductoMovimientoService.
     * Valores: SPEI | DEPOSITO | RETIRO | PAGO
     */
    private String tipoOperacion;

    /**
     * Alias de compatibilidad — usado por CuentasCliente.jsx (página existente).
     * Devuelve el mismo valor que tipoOperacion.
     */
    private String tipoOp;

    private BigDecimal monto;
    private BigDecimal saldoAntes;
    private BigDecimal saldoDespues;
    private String cuentaDestino;
    private String concepto;
    private String estado;
    private String canal;
    private LocalDateTime createdAt;

    // RF-CLI-08 — flags de trazabilidad
    private boolean comprobanteGenerado;
    private boolean sospechosa;

    private String clienteNombre;
    private String numeroCuentaOrigen;
}
