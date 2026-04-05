package com.banquito.cliente.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaResponseDTO {
    private Integer idCuenta;
    private String clabe;
    private String numeroCuenta;
    private String tipoCuenta;
    private BigDecimal saldo;
    private BigDecimal limiteDiario;
    private String estado;
    private String clienteNombre;
    private String sucursalNombre;
}
