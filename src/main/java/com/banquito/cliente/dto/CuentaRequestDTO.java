package com.banquito.cliente.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaRequestDTO {

    @NotNull(message = "El cliente es obligatorio")
    private Integer idCliente;

    @NotNull(message = "La sucursal es obligatoria")
    private Integer idSucursal;

    @NotBlank(message = "El tipo de cuenta es obligatorio")
    @Pattern(regexp = "AHORRO|NOMINA|CHEQUES", message = "Tipo debe ser AHORRO, NOMINA o CHEQUES")
    private String tipoCuenta;
}
