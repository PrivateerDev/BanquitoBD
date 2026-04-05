package com.banquito.cliente.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SolicitudResponseDTO {
    private Integer idSolicitud;
    private String tipoProducto;
    private BigDecimal monto;
    private Integer plazo;
    private String estado;
    private String folioSeguimiento;
    private LocalDateTime createdAt;
}
