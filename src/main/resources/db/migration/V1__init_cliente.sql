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
