package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad: tbltransaccion
 * Restaurada con los campos originales que usa TransaccionService (tipoOp, saldoAntes,
 * saldoDespues, cuenta, cliente, cuentaDestino, createdAt).
 *
 * Trazabilidad:
 *  RF-CLI-02  → operaciones financieras (SPEI/transferencias)
 *  RF-CLI-08  → comprobante generado
 *  RNF-CLI-02 → tiempo < 5 s
 *  RNF-CLI-03 → otpValidado
 *  RNF-CLI-08 → sospechosa
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tbltransaccion")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idtransaccion")
    private Integer idTransaccion;

    // Relación con la cuenta origen (usada por TransaccionService)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcuenta", nullable = false)
    private Cuenta cuenta;

    // Relación con el cliente (usada por TransaccionService)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    private Cliente cliente;

    // Tipo de operación — ej. "SPEI", "DEPOSITO", "RETIRO", "PAGO"
    // RF-CLI-02
    @Column(name = "tipoop", nullable = false, length = 30)
    private String tipoOp;

    @Column(name = "monto", nullable = false, precision = 14, scale = 2)
    private BigDecimal monto;

    // RF-CLI-02: saldo antes y después de la operación
    @Column(name = "saldoantes", precision = 14, scale = 2)
    private BigDecimal saldoAntes;

    @Column(name = "saldodespues", precision = 14, scale = 2)
    private BigDecimal saldoDespues;

    // CLABE o número de cuenta destino para transferencias
    @Column(name = "cuentadestino", length = 18)
    private String cuentaDestino;

    @Column(name = "concepto", length = 200)
    private String concepto;

    // WEB | CAJERO_ATM | SUCURSAL — RF-CLI-02
    @Column(name = "canal", length = 15)
    private String canal;

    // COMPLETADA | PENDIENTE | CANCELADA | REVERTIDA — RF-CLI-02
    @Column(name = "estado", nullable = false, length = 15)
    private String estado;

    // 1 si se validó con OTP — RNF-CLI-03
    @Column(name = "otpvalidado", nullable = false)
    private Short otpValidado;

    // 1 si se generó comprobante PDF/XML — RF-CLI-08
    @Column(name = "comprobante_generado", nullable = false)
    private boolean comprobanteGenerado;

    // 1 si fue marcada por detección de fraude — RNF-CLI-08
    @Column(name = "sospechosa", nullable = false)
    private boolean sospechosa;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.otpValidado == null) this.otpValidado = 0;
    }
}
