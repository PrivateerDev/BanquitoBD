package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblsucursal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsucursal")
    private Integer idSucursal;

    @Column(name = "nombre", nullable = false, length = 60)
    private String nombre;

    @Column(name = "direccion", nullable = false, length = 200)
    private String direccion;

    @Column(name = "ciudad", nullable = false, length = 60)
    private String ciudad;

    @Column(name = "activa", nullable = false)
    private Short activa;

    @Column(name = "fechaapertura", nullable = false)
    private LocalDate fechaApertura;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.activa == null) this.activa = 1;
        if (this.ciudad == null) this.ciudad = "CDMX";
    }
}
