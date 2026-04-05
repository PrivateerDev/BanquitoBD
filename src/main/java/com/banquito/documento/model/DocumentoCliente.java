package com.banquito.documento.model;

import com.banquito.cliente.model.Cliente;
import com.banquito.cliente.model.SolicitudCredito;
import com.banquito.empleado.model.Empleado;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbldocumentocliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddocumento")
    private Integer idDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idcliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idsolicitud")
    private SolicitudCredito solicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idempleado", nullable = false)
    private Empleado empleado;

    @Column(name = "tipodocumento", nullable = false, length = 40)
    private String tipoDocumento;

    @Column(name = "nombrearchivo", nullable = false, length = 200)
    private String nombreArchivo;

    @Column(name = "rutaarchivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(name = "mimetype", nullable = false, length = 80)
    private String mimeType;

    @Column(name = "tamaniobytes", nullable = false)
    private Integer tamanioBytes;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "observaciones")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idempleadorevisor")
    private Empleado empleadoRevisor;

    @Column(name = "fecharevision")
    private LocalDateTime fechaRevision;

    @Column(name = "createdat", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedat", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.estado == null) this.estado = "PENDIENTE";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
