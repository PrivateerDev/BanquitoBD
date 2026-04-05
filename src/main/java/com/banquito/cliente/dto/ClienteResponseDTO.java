package com.banquito.cliente.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponseDTO {
    private Integer idCliente;
    private String nombre;
    private String apellidoPat;
    private String apellidoMat;
    private String email;
    private String telefono;
    private String rfc;
    private String curp;
    private Short activo;
    private String sucursalNombre;
}
