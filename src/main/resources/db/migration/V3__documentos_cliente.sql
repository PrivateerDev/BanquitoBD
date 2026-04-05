-- =============================================
-- V3: Documentos digitalizados del cliente
-- Flujo: Ejecutivo Sucursal → Evaluación Bancaria (Rol 43)
-- Referencia: tbl_expediente_credito (BDJur) + tblcliente
-- =============================================

CREATE TABLE tbldocumentocliente (
    iddocumento     SERIAL PRIMARY KEY,
    idcliente       INT          NOT NULL REFERENCES tblcliente(idcliente),
    idsolicitud     INT          NULL REFERENCES tblsolicitudcredito(idsolicitud),
    idempleado      INT          NOT NULL REFERENCES tblempleado(idempleado),
    tipodocumento   VARCHAR(40)  NOT NULL,
    -- INE_FRENTE, INE_REVERSO, COMPROBANTE_DOMICILIO,
    -- RFC_CURP, COMPROBANTE_INGRESOS
    nombrearchivo   VARCHAR(200) NOT NULL,
    rutaarchivo     VARCHAR(500) NOT NULL,  -- path relativo en servidor
    mimetype        VARCHAR(80)  NOT NULL,  -- application/pdf, image/jpeg, etc.
    tamaniobytes    INT          NOT NULL,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE',
    -- PENDIENTE, VALIDADO, RECHAZADO
    observaciones   TEXT         NULL,      -- notas del evaluador al rechazar
    idempleadorevisor INT        NULL REFERENCES tblempleado(idempleado),
    fecharevision   TIMESTAMP    NULL,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX idx_doc_cliente   ON tbldocumentocliente(idcliente);
CREATE INDEX idx_doc_solicitud ON tbldocumentocliente(idsolicitud);
CREATE INDEX idx_doc_estado    ON tbldocumentocliente(estado);

-- Comentarios para trazabilidad
COMMENT ON TABLE  tbldocumentocliente IS 'Expediente digital KYC por cliente — RF-EVAL-01, Flujo 1';
COMMENT ON COLUMN tbldocumentocliente.rutaarchivo IS 'Ruta relativa: /uploads/docs/{idcliente}/{uuid}.pdf';
COMMENT ON COLUMN tbldocumentocliente.idempleadorevisor IS 'Rol 43: Especialista en Evaluación Bancaria';
