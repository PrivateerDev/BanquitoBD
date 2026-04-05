package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblcuenta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcuenta")
    private Integer idCuenta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idsucursal", nullable = false)
    private Sucursal sucursal;

    @Column(name = "clabe", nullable = false, unique = true, length = 18)
    private String clabe;

    @Column(name = "numerocuenta", nullable = false, unique = true, length = 20)
    private String numeroCuenta;

    @Column(name = "tipocuenta", nullable = false, length = 30)
    private String tipoCuenta;

    @Column(name = "saldo", nullable = false, precision = 14, scale = 2)
    private BigDecimal saldo;

    @Column(name = "limitediario", nullable = false, precision = 14, scale = 2)
    private BigDecimal limiteDiario;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedat", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.saldo == null) this.saldo = BigDecimal.ZERO;
        if (this.limiteDiario == null) this.limiteDiario = new BigDecimal("10000.00");
        if (this.estado == null) this.estado = "ACTIVA";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
