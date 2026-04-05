package com.banquito.cliente.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbltarjeta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarjeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idtarjeta")
    private Integer idTarjeta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcuenta")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cuenta cuenta;

    @Column(name = "numerotarjeta", nullable = false, length = 16, unique = true)
    private String numeroTarjeta;

    @Column(name = "tipotarjeta", nullable = false, length = 20)
    private String tipoTarjeta;

    @Column(name = "fechavenc", nullable = false)
    private LocalDate fechaVenc;

    @Column(name = "limitecredito", precision = 14, scale = 2)
    private BigDecimal limiteCredito;

    @Column(name = "saldodisponible", nullable = false, precision = 14, scale = 2)
    private BigDecimal saldoDisponible;

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
        if (this.estado == null) this.estado = "ACTIVA";
        if (this.saldoDisponible == null) this.saldoDisponible = BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
