-- V12__empleado_password_bcrypt.sql
-- Re-hashea las contrasenas semilla de tblempleado (antes texto plano, V7) a BCrypt.
-- No modifica V1-V11. Hashes generados con BCryptPasswordEncoder (cost=10).

UPDATE tblempleado
SET passwordhash = '$2b$10$Bn4CtO7LdiVcDM/R5O7ACOxjW2f7f3bUSVoHYm.tq1XMx2ZNoXfqq'
WHERE email IN ('laura.ramirez@banquito.mx', 'marco.sanchez@banquito.mx', 'admin@banquito.mx')
  AND passwordhash = 'banquito2026';

UPDATE tblempleado
SET passwordhash = '$2b$10$sQ5syhd3dTStokKOwgo0K.cc.CHCrzXJNXT/GjdbUXwBfpxyOwFvS'
WHERE email = 'carlos.mendoza@banquito.mx'
  AND passwordhash = 'eval2026';

COMMENT ON COLUMN tblempleado.passwordhash IS
    'Hash BCrypt (cost=10) generado por BCryptPasswordEncoder. Ver V12.';
