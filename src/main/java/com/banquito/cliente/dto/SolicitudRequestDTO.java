package com.banquito.cliente.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SolicitudRequestDTO {
    private Integer idCliente;
    private String tipoProducto;
    private BigDecimal monto;
    private Integer plazo;
}
