package com.banquito.cliente.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloqueoTarjetaResponseDTO {
    private Integer idBloqueo;
    private Integer idTarjeta;
    private Integer idCliente;
    private String folio;
    private String motivo;
    private String descripcion;
    private Short notificadoSms;
    private Short notificadoEmail;
    private LocalDateTime createdAt;
}
