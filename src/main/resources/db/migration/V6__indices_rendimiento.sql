-- V6__indices_rendimiento.sql
-- Indices de rendimiento — RNF-ES-01, RNF-CLI-02

-- tblempleado: busqueda por rol y sucursal
CREATE INDEX IF NOT EXISTS idx_empleado_rol
    ON tblempleado(rol) WHERE activo = 1;

CREATE INDEX IF NOT EXISTS idx_empleado_sucursal
    ON tblempleado(idsucursal) WHERE activo = 1;

-- tbltransaccion: movimientos por cuenta y cliente con orden por fecha
CREATE INDEX IF NOT EXISTS idx_tx_cuenta_fecha
    ON tbltransaccion(idcuenta, createdat DESC);

CREATE INDEX IF NOT EXISTS idx_tx_cliente_fecha
    ON tbltransaccion(idcliente, createdat DESC);

CREATE INDEX IF NOT EXISTS idx_tx_empleado_registro
    ON tbltransaccion(idempleado_registro)
    WHERE idempleado_registro IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tx_sospechosa
    ON tbltransaccion(sospechosa, createdat DESC)
    WHERE sospechosa = TRUE;

-- tblcuenta: cuentas por cliente y busqueda por CLABE
CREATE INDEX IF NOT EXISTS idx_cuenta_cliente_estado
    ON tblcuenta(idcliente, estado);

CREATE INDEX IF NOT EXISTS idx_cuenta_clabe
    ON tblcuenta(clabe);

-- tblsolicitudcredito: solicitudes por cliente
CREATE INDEX IF NOT EXISTS idx_solicitud_cliente_fecha
    ON tblsolicitudcredito(idcliente, createdat DESC);

CREATE INDEX IF NOT EXISTS idx_solicitud_estado
    ON tblsolicitudcredito(estado)
    WHERE estado IN ('EN_EVALUACION', 'APROBADA');
