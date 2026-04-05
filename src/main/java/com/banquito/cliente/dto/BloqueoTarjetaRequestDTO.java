package com.banquito.cliente.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloqueoTarjetaRequestDTO {
    private Integer idTarjeta;
    private Integer idCliente;
    private String motivo;
    private String descripcion;
}
