package com.banquito.empleado.model;

import com.banquito.cliente.model.Sucursal;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblempleado")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idempleado")
    private Integer idEmpleado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idsucursal", nullable = false)
    private Sucursal sucursal;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellidopat", nullable = false, length = 60)
    private String apellidoPat;

    @Column(name = "apellidomat", length = 60)
    private String apellidoMat;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "passwordhash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "rol", nullable = false, length = 40)
    private String rol;

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
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
