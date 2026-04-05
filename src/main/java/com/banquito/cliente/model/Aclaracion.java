package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblaclaracion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aclaracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idaclaracion")
    private Integer idAclaracion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idtransaccion", nullable = false)
    private Transaccion transaccion;

    @Column(name = "folio", nullable = false, length = 20, unique = true)
    private String folio;

    @Column(name = "tipoaclaracion", nullable = false, length = 50)
    private String tipoAclaracion;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "monto", precision = 14, scale = 2)
    private BigDecimal monto;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "plazoregulatorio", nullable = false)
    private LocalDate plazoRegulatorio;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedat", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.estado == null) this.estado = "EN_REVISION";
        if (this.plazoRegulatorio == null) this.plazoRegulatorio = LocalDate.now().plusDays(45);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
