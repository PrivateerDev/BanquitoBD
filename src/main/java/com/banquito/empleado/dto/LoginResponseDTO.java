package com.banquito.empleado.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private Integer idEmpleado;
    private String nombre;
    private String apellidoPat;
    private String email;
    private String rol;
    private String sucursalNombre;
    private String token;
}
