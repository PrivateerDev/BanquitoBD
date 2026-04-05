-- V7__empleado_constraints_semilla.sql
-- CHECK constraints + datos semilla oficiales

-- 1. tblempleado
ALTER TABLE tblempleado
    ADD CONSTRAINT chk_empleado_rol
    CHECK (rol IN ('EJECUTIVO_SUCURSAL', 'SUPERVISOR', 'EVALUADOR'));

ALTER TABLE tblempleado
    ADD CONSTRAINT chk_empleado_activo
    CHECK (activo IN (0, 1));

-- 2. tblcuenta
ALTER TABLE tblcuenta
    ADD CONSTRAINT chk_cuenta_tipocuenta
    CHECK (tipocuenta IN ('AHORRO', 'NOMINA', 'CHEQUES', 'INVERSION'));

ALTER TABLE tblcuenta
    ADD CONSTRAINT chk_cuenta_estado
    CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'CANCELADA'));

ALTER TABLE tblcuenta
    ADD CONSTRAINT chk_cuenta_saldo_positivo
    CHECK (saldo >= 0);

-- 3. tblsolicitudcredito
ALTER TABLE tblsolicitudcredito
    ADD CONSTRAINT chk_solicitud_estado
    CHECK (estado IN ('EN_EVALUACION', 'APROBADA', 'RECHAZADA', 'CANCELADA', 'PENDIENTE'));

ALTER TABLE tblsolicitudcredito
    ADD CONSTRAINT chk_solicitud_tipoproducto
    CHECK (tipoproducto IN (
        'CREDITO_PERSONAL', 'CREDITO_AUTOMOTRIZ',
        'HIPOTECARIO', 'TARJETA', 'CUENTA'
    ));

-- 4. Datos semilla idempotentes (no duplica si ya existen)
INSERT INTO tblempleado (idsucursal, nombre, apellidopat, apellidomat, email, passwordhash, rol, activo, createdat, updatedat)
SELECT 1, 'Laura', 'Ramírez', 'Torres', 'laura.ramirez@banquito.mx', 'banquito2026', 'EJECUTIVO_SUCURSAL', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tblempleado WHERE email = 'laura.ramirez@banquito.mx');

INSERT INTO tblempleado (idsucursal, nombre, apellidopat, apellidomat, email, passwordhash, rol, activo, createdat, updatedat)
SELECT 1, 'Marco', 'Sánchez', 'Vega', 'marco.sanchez@banquito.mx', 'banquito2026', 'EJECUTIVO_SUCURSAL', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tblempleado WHERE email = 'marco.sanchez@banquito.mx');

INSERT INTO tblempleado (idsucursal, nombre, apellidopat, apellidomat, email, passwordhash, rol, activo, createdat, updatedat)
SELECT 1, 'Admin', 'Banquito', NULL, 'admin@banquito.mx', 'banquito2026', 'SUPERVISOR', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tblempleado WHERE email = 'admin@banquito.mx');

INSERT INTO tblempleado (idsucursal, nombre, apellidopat, apellidomat, email, passwordhash, rol, activo, createdat, updatedat)
SELECT 2, 'Carlos', 'Mendoza', 'Ruiz', 'carlos.mendoza@banquito.mx', 'eval2026', 'EVALUADOR', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tblempleado WHERE email = 'carlos.mendoza@banquito.mx');

-- 5. Comentarios en columnas clave
COMMENT ON COLUMN tbltransaccion.idempleado_registro IS
    'Empleado que registró la operación. NULL si fue WEB o CAJERO_ATM sin asistencia.';

COMMENT ON COLUMN tblempleado.passwordhash IS
    'Demo: texto plano. Producción: reemplazar con bcrypt al implementar JWT.';
