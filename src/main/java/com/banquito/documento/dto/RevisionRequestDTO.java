package com.banquito.documento.dto;

import lombok.Data;

@Data
public class RevisionRequestDTO {
    private String  estado;        // VALIDADO o RECHAZADO
    private String  observaciones;
    private Integer idEmpleadoRevisor;
}
