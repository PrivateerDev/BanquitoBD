# BanquitoBD
Sistema bancario integral para Banquito S.A. de C.V. — Spring Boot 3 · React · PostgreSQL · JWT · Flyway

# Banquito — Sistema de Información Bancario Integral

Proyecto académico desarrollado para la materia **Base de Datos** (UACM, Ingeniería de Software, 2026-1),
bajo la cátedra del Prof. Edwin Bryan Salas López.

## Descripción

Sistema de información bancario full-stack para **Banquito S.A. de C.V.**, institución financiera privada
con 3 sucursales en la Ciudad de México. Cubre los procesos operativos de 51 actores organizados en 8 áreas:
Finanzas, TI, RH, Comercial, Jurídica, Seguridad Física, Operaciones Bancarias y Atención al Cliente,
además del módulo de autoservicio para el cliente externo.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Java 21 · Spring Boot 3.4 · Spring Security · JPA/Hibernate |
| Frontend | React 18 · Vite · Tailwind CSS · React Router |
| Base de datos | PostgreSQL 16 · Flyway (migraciones versionadas) |
| Autenticación | JWT · Roles: SUPERVISOR, EVALUADOR, CAJERO, CLIENTE |

## Módulos implementados

- **Gestión de clientes** — registro, expediente y consulta
- **Cuentas y productos bancarios** — altas, movimientos y estados de cuenta
- **Transferencias SPEI** — con validación de saldo y auditoría
- **Detección de transacciones sospechosas** — RF-CLI-08 / RNF-CLI-08, índice parcial `idx_tx_sospechosa`
- **Evaluación de documentos** — flujo Evaluador → Supervisor
- **Control de acceso por rol** — rutas protegidas en frontend y backend

## Cumplimiento regulatorio

Diseñado considerando disposiciones de **CNBV, Banxico, SAT, IMSS, INFONAVIT y CONDUSEF**.

- Andrea Marlene Ortega Almendares — matrícula 17-002-1026
