package com.banquito.cliente.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AclaracionRequestDTO {

    @NotNull(message = "idCliente es requerido")
    @Positive(message = "idCliente debe ser mayor a 0")
    private Integer idCliente;

    @NotNull(message = "idTransaccion es requerido")
    @Positive(message = "idTransaccion debe ser mayor a 0")
    private Integer idTransaccion;

    @NotBlank(message = "tipoAclaracion es requerido")
    private String tipoAclaracion;

    @NotBlank(message = "descripcion es requerida")
    @Size(min = 10, max = 500, message = "descripcion debe tener entre 10 y 500 caracteres")
    private String descripcion;

    @DecimalMin(value = "0.01", message = "monto debe ser mayor a 0")
    private BigDecimal monto;
}
