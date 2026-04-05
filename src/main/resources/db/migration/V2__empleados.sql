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
