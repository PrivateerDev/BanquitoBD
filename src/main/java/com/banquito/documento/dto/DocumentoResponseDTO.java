package com.banquito.documento.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentoResponseDTO {
    private Integer idDocumento;
    private Integer idCliente;
    private String  nombreCliente;
    private Integer idEmpleado;
    private String  nombreEmpleado;
    private String  tipoDocumento;
    private String  nombreArchivo;
    private String  mimeType;
    private Integer tamanioBytes;
    private String  estado;
    private String  observaciones;
    private String  nombreRevisor;
    private LocalDateTime fechaRevision;
    private LocalDateTime createdAt;
    // Nuevos campos: solicitud vinculada
    private Integer idSolicitud;
    private String  tipoProducto;
    private String  folioSolicitud;
}
