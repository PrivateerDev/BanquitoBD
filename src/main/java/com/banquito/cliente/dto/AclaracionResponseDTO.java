package com.banquito.cliente.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AclaracionResponseDTO {
    private Integer idAclaracion;
    private Integer idCliente;
    private Integer idTransaccion;
    private String folio;
    private String tipoAclaracion;
    private String descripcion;
    private BigDecimal monto;
    private String estado;
    private LocalDate plazoRegulatorio;
    private LocalDateTime createdAt;
}
