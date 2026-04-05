package com.banquito.cliente.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de movimientos de cuenta para el Empleado de Sucursal.
 *
 * Trazabilidad: RF-CLI-02 · RF-CLI-08 · RNF-CLI-02 (<5s) · RNF-CLI-08 (fraude)
 * CU-CLI-01: Consultar saldos y lista movimientos de todos sus productos
 * Tabla fuente: tbltransaccion
 *
 * NOTA: los campos coinciden con el modelo Transaccion real del proyecto:
 *   tipoOp, monto, concepto, canal, estado, sospechosa, comprobanteGenerado, createdAt
 */
@Data
@Builder
public class MovimientoCuentaDTO {

    // Cuenta consultada — RF-CLI-01
    private Integer    idCuenta;
    private String     numeroCuenta;
    private String     tipoCuenta;
    private BigDecimal saldoActual;

    // Lista de movimientos — RF-CLI-02
    private List<MovimientoDTO> movimientos;

    @Data
    @Builder
    public static class MovimientoDTO {
        private Integer    idTransaccion;

        /** Tipo: SPEI | DEPOSITO | RETIRO | PAGO — RF-CLI-02 */
        private String     tipoOperacion;

        private BigDecimal monto;
        private String     concepto;

        /** WEB | CAJERO_ATM | SUCURSAL — RF-CLI-02 */
        private String     canal;

        /** COMPLETADA | PENDIENTE | CANCELADA | REVERTIDA — RF-CLI-02 */
        private String     estado;

        /** Marcada por detección de fraude — RNF-CLI-08 */
        private boolean    sospechosa;

        /** Comprobante generado PDF/XML — RF-CLI-08 */
        private boolean    comprobanteGenerado;

        private LocalDateTime timestamp;
    }
}
