-- V13__bitacora_acceso.sql
-- Bitacora de auditoria para accesos a informacion confidencial
-- (clientes, cuentas, transacciones, creditos).

CREATE TABLE tblbitacoraacceso (
    idbitacora   BIGSERIAL PRIMARY KEY,
    usuario      VARCHAR(120),
    recurso      VARCHAR(255) NOT NULL,
    accion       VARCHAR(40)  NOT NULL,
    fechahora    TIMESTAMP    NOT NULL DEFAULT NOW(),
    resultado    VARCHAR(20)  NOT NULL,
    detalle      VARCHAR(500),
    CONSTRAINT chk_bitacora_resultado CHECK (resultado IN ('EXITO', 'RECHAZO'))
);

CREATE INDEX idx_bitacora_usuario ON tblbitacoraacceso(usuario);
CREATE INDEX idx_bitacora_fechahora ON tblbitacoraacceso(fechahora);

COMMENT ON TABLE tblbitacoraacceso IS
    'Registro de auditoria de accesos a endpoints con informacion confidencial.';
