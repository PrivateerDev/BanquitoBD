package com.banquito.cliente.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRequestDTO {

    @NotNull(message = "La sucursal es obligatoria")
    private Integer idSucursal;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Size(max = 60)
    private String apellidoPat;

    @Size(max = 60)
    private String apellidoMat;

    @NotBlank(message = "El RFC es obligatorio")
    @Size(min = 12, max = 13, message = "El RFC debe tener 12 o 13 caracteres")
    private String rfc;

    @NotBlank(message = "El CURP es obligatorio")
    @Size(min = 18, max = 18, message = "El CURP debe tener exactamente 18 caracteres")
    private String curp;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener 10 dígitos")
    private String telefono;

    @NotBlank(message = "El PIN es obligatorio")
    @Size(min = 6, max = 6, message = "El PIN debe tener exactamente 6 dígitos")
    @Pattern(regexp = "^[0-9]{6}$", message = "El PIN solo puede contener números")
    private String pin;
}
