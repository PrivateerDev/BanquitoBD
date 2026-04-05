package com.banquito.cliente.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tblsolicitudcredito")
public class SolicitudCredito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idsolicitud;
    @Column(nullable = false) private Integer idcliente;
    @Column(nullable = false) private String tipoproducto;
    private BigDecimal monto;
    private Integer plazo;
    @Column(nullable = false) private String estado = "EN_EVALUACION";
    @Column(nullable = false, unique = true) private String folioseguimiento;
    private LocalDateTime createdat;
    private LocalDateTime updatedat;
}
