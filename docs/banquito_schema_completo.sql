-- =============================================
-- V1: Tablas base del módulo Cliente (Rol 51)
-- Trazabilidad: RF-CLI-01 a RF-CLI-08
-- =============================================

-- Catálogo de sucursales (compartida por todos los módulos)
CREATE TABLE tblsucursal (
    idsucursal      SERIAL PRIMARY KEY,
    nombre          VARCHAR(60)  NOT NULL,
    direccion       VARCHAR(200) NOT NULL,
    ciudad          VARCHAR(60)  NOT NULL DEFAULT 'CDMX',
    activa          SMALLINT     NOT NULL DEFAULT 1,
    fechaapertura   DATE         NOT NULL,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Cliente
CREATE TABLE tblcliente (
    idcliente       SERIAL PRIMARY KEY,
    idsucursal      INT          NOT NULL REFERENCES tblsucursal(idsucursal),
    nombre          VARCHAR(100) NOT NULL,
    apellidopat     VARCHAR(60)  NOT NULL,
    apellidomat     VARCHAR(60),
    rfc             VARCHAR(13)  NOT NULL UNIQUE,
    curp            VARCHAR(18)  NOT NULL UNIQUE,
    email           VARCHAR(120) NOT NULL UNIQUE,
    telefono        VARCHAR(15),
    pin             VARCHAR(255) NOT NULL,  -- hash bcrypt
    intentospin     SMALLINT     NOT NULL DEFAULT 0,
    bloqueadohasta  TIMESTAMP    NULL,
    activo          SMALLINT     NOT NULL DEFAULT 1,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Cuentas bancarias (CLABE 18 dígitos)
CREATE TABLE tblcuenta (
    idcuenta        SERIAL PRIMARY KEY,
    idcliente       INT             NOT NULL REFERENCES tblcliente(idcliente),
    idsucursal      INT             NOT NULL REFERENCES tblsucursal(idsucursal),
    clabe           VARCHAR(18)     NOT NULL UNIQUE,
    numerocuenta    VARCHAR(20)     NOT NULL UNIQUE,
    tipocuenta      VARCHAR(30)     NOT NULL, -- AHORRO, NOMINA, CHEQUES
    saldo           DECIMAL(14,2)   NOT NULL DEFAULT 0.00,
    limitediario    DECIMAL(14,2)   NOT NULL DEFAULT 10000.00,
    estado          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVA', -- ACTIVA, BLOQUEADA, CANCELADA
    createdat       TIMESTAMP       NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Tarjetas de débito/crédito
CREATE TABLE tbltarjeta (
    idtarjeta       SERIAL PRIMARY KEY,
    idcliente       INT          NOT NULL REFERENCES tblcliente(idcliente),
    idcuenta        INT          NULL REFERENCES tblcuenta(idcuenta),
    numerotarjeta   VARCHAR(16)  NOT NULL UNIQUE,
    tipotarjeta     VARCHAR(20)  NOT NULL, -- DEBITO, CREDITO
    fechavenc       DATE         NOT NULL,
    limitecredito   DECIMAL(14,2) NULL,
    saldodisponible DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVA', -- ACTIVA, BLOQUEADA, CANCELADA
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Transacciones (RF-CLI-02: SPEI, pagos, retiros)
CREATE TABLE tbltransaccion (
    idtransaccion   SERIAL PRIMARY KEY,
    idcuenta        INT             NOT NULL REFERENCES tblcuenta(idcuenta),
    idcliente       INT             NOT NULL REFERENCES tblcliente(idcliente),
    tipoop          VARCHAR(30)     NOT NULL, -- SPEI, PAGO, RETIRO, DEPOSITO
    monto           DECIMAL(14,2)   NOT NULL,
    saldoantes      DECIMAL(14,2)   NOT NULL,
    saldodespues    DECIMAL(14,2)   NOT NULL,
    cuentadestino   VARCHAR(18)     NULL,  -- CLABE destino en SPEI
    concepto        VARCHAR(200)    NULL,
    referencia      VARCHAR(50)     NULL,
    otpvalidado     SMALLINT        NOT NULL DEFAULT 0,
    estado          VARCHAR(20)     NOT NULL DEFAULT 'COMPLETADA', -- COMPLETADA, FALLIDA, PENDIENTE
    canal           VARCHAR(20)     NOT NULL, -- WEB, ATM, SUCURSAL
    createdat       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Bloqueo de medios de pago (RF-CLI-05: ≤30 segundos)
CREATE TABLE tblbloqueotarjeta (
    idbloqueo       SERIAL PRIMARY KEY,
    idtarjeta       INT          NOT NULL REFERENCES tbltarjeta(idtarjeta),
    idcliente       INT          NOT NULL REFERENCES tblcliente(idcliente),
    folio           VARCHAR(20)  NOT NULL UNIQUE, -- formato BLQ-YYYY-NNNN
    motivo          VARCHAR(20)  NOT NULL, -- ROBO, PERDIDA, CLONACION, NO_RECONOCIDO
    descripcion     TEXT         NULL,
    notificadosms   SMALLINT     NOT NULL DEFAULT 0,
    notificadoemail SMALLINT     NOT NULL DEFAULT 0,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Aclaraciones (RF-CLI-06: plazo 45 días CONDUSEF)
CREATE TABLE tblaclaracion (
    idaclaracion    SERIAL PRIMARY KEY,
    idcliente       INT          NOT NULL REFERENCES tblcliente(idcliente),
    idtransaccion   INT          NOT NULL REFERENCES tbltransaccion(idtransaccion),
    folio           VARCHAR(20)  NOT NULL UNIQUE, -- formato ACL-YYYY-NNNN
    tipoaclaracion  VARCHAR(50)  NOT NULL,
    descripcion     TEXT         NOT NULL,
    monto           DECIMAL(14,2) NULL,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'EN_REVISION', -- EN_REVISION, RESUELTA, CERRADA
    plazoregulatorio DATE         NOT NULL, -- createdat + 45 días
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Solicitudes de productos bancarios (RF-CLI-03)
CREATE TABLE tblsolicitudcredito (
    idsolicitud     SERIAL PRIMARY KEY,
    idcliente       INT          NOT NULL REFERENCES tblcliente(idcliente),
    tipoproducto    VARCHAR(50)  NOT NULL, -- AHORRO, TARJETA, PERSONAL, HIPOTECARIO, AUTOMOTRIZ
    monto           DECIMAL(14,2) NULL,
    plazo           INT          NULL,
    estado          VARCHAR(30)  NOT NULL DEFAULT 'EN_EVALUACION',
    folioseguimiento VARCHAR(20) NOT NULL UNIQUE,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);
-- =============================================
-- V2: Tabla de empleados de sucursal
-- =============================================

CREATE TABLE tblempleado (
    idempleado      SERIAL PRIMARY KEY,
    idsucursal      INT          NOT NULL REFERENCES tblsucursal(idsucursal),
    nombre          VARCHAR(100) NOT NULL,
    apellidopat     VARCHAR(60)  NOT NULL,
    apellidomat     VARCHAR(60),
    email           VARCHAR(120) NOT NULL UNIQUE,
    passwordhash    VARCHAR(255) NOT NULL,
    rol             VARCHAR(40)  NOT NULL DEFAULT 'EJECUTIVO_SUCURSAL',
    activo          SMALLINT     NOT NULL DEFAULT 1,
    createdat       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Empleados de prueba (password: banquito2026 en bcrypt)
INSERT INTO tblempleado (idsucursal, nombre, apellidopat, apellidomat, email, passwordhash, rol)
VALUES
  (1, 'Laura',  'Ramírez',  'Vega',    'laura.ramirez@banquito.mx',  '$2a$10$7QJ1V3m9K2pL8nX5wY6uOeZdRkTcMvBqAsFhNjIyWlEgPoDxCr4Gu', 'EJECUTIVO_SUCURSAL'),
  (1, 'Marco',  'Torres',   'Ávila',   'marco.torres@banquito.mx',   '$2a$10$7QJ1V3m9K2pL8nX5wY6uOeZdRkTcMvBqAsFhNjIyWlEgPoDxCr4Gu', 'EJECUTIVO_SUCURSAL'),
  (1, 'Admin',  'Banquito', NULL,      'admin@banquito.mx',          '$2a$10$7QJ1V3m9K2pL8nX5wY6uOeZdRkTcMvBqAsFhNjIyWlEgPoDxCr4Gu', 'SUPERVISOR');
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
-- ============================================================
-- BANQUITO — V4: tbltransaccion (idempotente)
-- La tabla puede existir parcialmente por migraciones previas fallidas.
-- Trazabilidad: RF-CLI-02, RF-CLI-08, RNF-CLI-02, RNF-CLI-03, RNF-CLI-08
-- ============================================================

-- 1. Crear tabla solo si no existe (con todas las columnas correctas)
CREATE TABLE IF NOT EXISTS tbltransaccion (
    idtransaccion        SERIAL PRIMARY KEY,
    idcuenta             INTEGER        NOT NULL REFERENCES tblcuenta(idcuenta),
    idcliente            INTEGER        NOT NULL REFERENCES tblcliente(idcliente),
    tipoop               VARCHAR(30)    NOT NULL,
    monto                NUMERIC(14,2)  NOT NULL,
    saldoantes           NUMERIC(14,2),
    saldodespues         NUMERIC(14,2),
    cuentadestino        VARCHAR(18),
    concepto             VARCHAR(200),
    canal                VARCHAR(15),
    estado               VARCHAR(15)    NOT NULL DEFAULT 'COMPLETADA',
    otpvalidado          SMALLINT       NOT NULL DEFAULT 0,
    comprobante_generado BOOLEAN        NOT NULL DEFAULT FALSE,
    sospechosa           BOOLEAN        NOT NULL DEFAULT FALSE,
    createdat            TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- 2. Añadir columnas que pueden faltar si la tabla existía incompleta
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS saldoantes           NUMERIC(14,2);
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS saldodespues         NUMERIC(14,2);
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS cuentadestino        VARCHAR(18);
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS concepto             VARCHAR(200);
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS canal                VARCHAR(15);
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS estado               VARCHAR(15) NOT NULL DEFAULT 'COMPLETADA';
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS otpvalidado          SMALLINT    NOT NULL DEFAULT 0;
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS comprobante_generado BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS sospechosa           BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE tbltransaccion ADD COLUMN IF NOT EXISTS createdat            TIMESTAMP   NOT NULL DEFAULT NOW();

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_tx_cuenta    ON tbltransaccion(idcuenta);
CREATE INDEX IF NOT EXISTS idx_tx_cliente   ON tbltransaccion(idcliente);
CREATE INDEX IF NOT EXISTS idx_tx_createdat ON tbltransaccion(createdat);

-- 4. Datos de prueba (solo si la tabla está vacía)
INSERT INTO tbltransaccion
    (idcuenta, idcliente, tipoop, monto, saldoantes, saldodespues, cuentadestino, concepto, canal, estado, otpvalidado, comprobante_generado, sospechosa, createdat)
SELECT * FROM (VALUES
    (3, 1, 'DEPOSITO',  15000.00::NUMERIC, 5000.00::NUMERIC,  20000.00::NUMERIC, NULL,                 'Deposito nomina marzo',       'SUCURSAL',   'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '25 days'),
    (3, 1, 'DEPOSITO',  15000.00::NUMERIC, 0.00::NUMERIC,      5000.00::NUMERIC, NULL,                 'Deposito nomina febrero',     'SUCURSAL',   'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '55 days'),
    (3, 1, 'RETIRO',     2500.00::NUMERIC, 20000.00::NUMERIC, 17500.00::NUMERIC, NULL,                 'Retiro cajero Insurgentes',   'CAJERO_ATM', 'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '20 days'),
    (3, 1, 'RETIRO',     1000.00::NUMERIC, 17500.00::NUMERIC, 16500.00::NUMERIC, NULL,                 'Retiro cajero Reforma',       'CAJERO_ATM', 'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '10 days'),
    (3, 1, 'SPEI',       5000.00::NUMERIC, 16500.00::NUMERIC, 11500.00::NUMERIC, '032180342991282007', 'Renta departamento',          'WEB',        'COMPLETADA', 1::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '15 days'),
    (3, 1, 'SPEI',       8000.00::NUMERIC, 11500.00::NUMERIC,  3500.00::NUMERIC, '032180000000000099', 'Pago proveedor externo',      'WEB',        'COMPLETADA', 1::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '5 days'),
    (3, 1, 'PAGO',       1200.00::NUMERIC,  3500.00::NUMERIC,  2300.00::NUMERIC, NULL,                 'CFE Luz enero',               'WEB',        'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '28 days'),
    (3, 1, 'PAGO',        800.00::NUMERIC,  2300.00::NUMERIC,  1500.00::NUMERIC, NULL,                 'TELMEX telefono',             'WEB',        'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '14 days'),
    (3, 1, 'PAGO',       3500.00::NUMERIC,  1500.00::NUMERIC,     0.00::NUMERIC, NULL,                 'Colegiatura escuela',         'SUCURSAL',   'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '7 days'),
    (3, 1, 'SPEI',      45000.00::NUMERIC, 20000.00::NUMERIC,     0.00::NUMERIC, '032999999999999999', 'Transferencia no reconocida', 'WEB',        'PENDIENTE',  1::SMALLINT, FALSE, TRUE,  NOW() - INTERVAL '2 days'),
    (5, 1, 'DEPOSITO',  20000.00::NUMERIC,     0.00::NUMERIC, 20000.00::NUMERIC, NULL,                 'Deposito inicial cheques',    'SUCURSAL',   'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '30 days'),
    (5, 1, 'RETIRO',     3000.00::NUMERIC, 20000.00::NUMERIC, 17000.00::NUMERIC, NULL,                 'Retiro sucursal Polanco',     'SUCURSAL',   'COMPLETADA', 0::SMALLINT, TRUE,  FALSE, NOW() - INTERVAL '3 days')
) AS datos(idcuenta, idcliente, tipoop, monto, saldoantes, saldodespues, cuentadestino, concepto, canal, estado, otpvalidado, comprobante_generado, sospechosa, createdat)
WHERE NOT EXISTS (SELECT 1 FROM tbltransaccion LIMIT 1);
-- V5__transaccion_coherencia.sql
-- Limpia columnas duplicadas, agrega idempleado_registro y CHECK constraints

-- 1. Migrar datos de referencia_numerica a referencia antes de borrar
UPDATE tbltransaccion
SET referencia = referencia_numerica
WHERE referencia IS NULL AND referencia_numerica IS NOT NULL;

-- 2. Eliminar columnas duplicadas/inconsistentes
ALTER TABLE tbltransaccion DROP COLUMN IF EXISTS idcuentaorigen;
ALTER TABLE tbltransaccion DROP COLUMN IF EXISTS idcuentadestino;
ALTER TABLE tbltransaccion DROP COLUMN IF EXISTS referencia_numerica;
ALTER TABLE tbltransaccion DROP COLUMN IF EXISTS timestamp_tx;

-- 3. Renombrar referencia -> referencia_numerica para coherencia con el modelo Java
ALTER TABLE tbltransaccion RENAME COLUMN referencia TO referencia_numerica;

-- 4. Agregar idempleado_registro (trazabilidad de cajero que registró la operacion)
ALTER TABLE tbltransaccion
    ADD COLUMN IF NOT EXISTS idempleado_registro INTEGER;

ALTER TABLE tbltransaccion
    ADD CONSTRAINT fk_tx_empleado_registro
    FOREIGN KEY (idempleado_registro)
    REFERENCES tblempleado(idempleado)
    ON DELETE SET NULL;

-- 5. CHECK constraints para validar valores
ALTER TABLE tbltransaccion
    ADD CONSTRAINT chk_tx_tipoop
    CHECK (tipoop IN ('SPEI', 'DEPOSITO', 'RETIRO', 'PAGO'));

ALTER TABLE tbltransaccion
    ADD CONSTRAINT chk_tx_estado
    CHECK (estado IN ('COMPLETADA', 'PENDIENTE', 'CANCELADA', 'REVERTIDA'));

ALTER TABLE tbltransaccion
    ADD CONSTRAINT chk_tx_canal
    CHECK (canal IN ('WEB', 'CAJERO_ATM', 'SUCURSAL'));

-- 6. saldoantes y saldodespues pasan a nullable
ALTER TABLE tbltransaccion ALTER COLUMN saldoantes  DROP NOT NULL;
ALTER TABLE tbltransaccion ALTER COLUMN saldodespues DROP NOT NULL;
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
