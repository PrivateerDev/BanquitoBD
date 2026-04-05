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
