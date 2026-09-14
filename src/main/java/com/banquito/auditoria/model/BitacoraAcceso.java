package com.banquito.auditoria.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblbitacoraacceso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BitacoraAcceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbitacora")
    private Long idBitacora;

    @Column(name = "usuario", length = 120)
    private String usuario;

    @Column(name = "recurso", nullable = false, length = 255)
    private String recurso;

    @Column(name = "accion", nullable = false, length = 40)
    private String accion;

    @Column(name = "fechahora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "resultado", nullable = false, length = 20)
    private String resultado;

    @Column(name = "detalle", length = 500)
    private String detalle;

    @PrePersist
    public void prePersist() {
        if (this.fechaHora == null) this.fechaHora = LocalDateTime.now();
    }
}
