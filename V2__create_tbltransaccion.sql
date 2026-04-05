-- ============================================================
-- BANQUITO — Script BD: tbltransaccion
-- Compatible con el modelo Transaccion.java real del proyecto
-- ============================================================

CREATE TABLE IF NOT EXISTS tbltransaccion (
    idtransaccion        INT AUTO_INCREMENT PRIMARY KEY,
    idcuenta             INT NOT NULL,
    idcliente            INT NOT NULL,
    tipoop               VARCHAR(30) NOT NULL,
    monto                DECIMAL(14,2) NOT NULL,
    saldoantes           DECIMAL(14,2) NULL,
    saldodespues         DECIMAL(14,2) NULL,
    cuentadestino        VARCHAR(18) NULL,
    concepto             VARCHAR(200) NULL,
    canal                VARCHAR(15) NULL,
    estado               VARCHAR(15) NOT NULL DEFAULT 'COMPLETADA',
    otpvalidado          SMALLINT NOT NULL DEFAULT 0,
    comprobante_generado TINYINT(1) NOT NULL DEFAULT 0,
    sospechosa           TINYINT(1) NOT NULL DEFAULT 0,
    createdat            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_cuenta  FOREIGN KEY (idcuenta) REFERENCES tblcuenta(idcuenta),
    CONSTRAINT fk_tx_cliente FOREIGN KEY (idcliente) REFERENCES tblcliente(idcliente)
);
