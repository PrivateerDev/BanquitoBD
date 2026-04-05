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
