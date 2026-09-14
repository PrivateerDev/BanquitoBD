package com.banquito.cliente.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteStatsDTO {
    private long totalClientes;
    private long totalActivos;
    private long totalSucursales;
}
