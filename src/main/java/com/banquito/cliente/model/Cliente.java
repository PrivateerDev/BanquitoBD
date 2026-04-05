package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblcliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcliente")
    private Integer idCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idsucursal", nullable = false)
    private Sucursal sucursal;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellidopat", nullable = false, length = 60)
    private String apellidoPat;

    @Column(name = "apellidomat", length = 60)
    private String apellidoMat;

    @Column(name = "rfc", nullable = false, unique = true, length = 13)
    private String rfc;

    @Column(name = "curp", nullable = false, unique = true, length = 18)
    private String curp;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "telefono", length = 15)
    private String telefono;

    @Column(name = "pin", nullable = false, length = 255)
    private String pin;

    @Column(name = "intentospin", nullable = false)
    private Short intentosPin;

    @Column(name = "bloqueadohasta")
    private LocalDateTime bloqueadoHasta;

    @Column(name = "activo", nullable = false)
    private Short activo;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedat", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.activo == null) this.activo = 1;
        if (this.intentosPin == null) this.intentosPin = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
