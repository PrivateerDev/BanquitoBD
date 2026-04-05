package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblbloqueotarjeta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloqueoTarjeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbloqueo")
    private Integer idBloqueo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idtarjeta", nullable = false)
    private Tarjeta tarjeta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    private Cliente cliente;

    @Column(name = "folio", nullable = false, length = 20, unique = true)
    private String folio;

    @Column(name = "motivo", nullable = false, length = 20)
    private String motivo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "notificadosms", nullable = false)
    private Short notificadoSms;

    @Column(name = "notificadoemail", nullable = false)
    private Short notificadoEmail;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.notificadoSms == null) this.notificadoSms = 0;
        if (this.notificadoEmail == null) this.notificadoEmail = 0;
    }
}
