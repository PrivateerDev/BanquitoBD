package com.banquito.cliente.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionRequestDTO {

    @NotNull(message = "La cuenta origen es obligatoria")
    private Integer idCuenta;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "1.00", message = "El monto mínimo es $1.00")
    @DecimalMax(value = "10000.00", message = "El monto máximo es $10,000.00 (límite diario)")
    private BigDecimal monto;

    @NotBlank(message = "La CLABE destino es obligatoria")
    @Size(min = 18, max = 18, message = "La CLABE destino debe tener 18 dígitos")
    @Pattern(regexp = "^[0-9]{18}$", message = "La CLABE solo debe contener números")
    private String cuentaDestino;

    @Size(max = 200)
    private String concepto;

    @NotBlank(message = "El OTP es obligatorio")
    @Size(min = 6, max = 6, message = "El OTP debe tener 6 dígitos")
    @Pattern(regexp = "^[0-9]{6}$", message = "El OTP solo puede contener números")
    private String otp;
}
