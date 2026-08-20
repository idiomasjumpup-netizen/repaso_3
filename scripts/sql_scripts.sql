-- ============================================================
-- EXAMEN COMPLEXIVO - SECCIÓN 1: BASE DE DATOS RELACIONAL (POSTGRESQL)
-- Dominio Rebrandeado: Sistema de Gestión Aeroportuaria (Airport System)
-- ============================================================

-- Pregunta 1 & 2: Crear Base de Datos y Usuario
CREATE DATABASE airport_db;
CREATE USER backend_user WITH PASSWORD 'admin123';

-- Pregunta 3: Asignar Permisos Mínimos
GRANT ALL PRIVILEGES ON DATABASE airport_db TO backend_user;
\c airport_db
ALTER SCHEMA public OWNER TO backend_user;
GRANT ALL ON SCHEMA public TO backend_user;

-- Pregunta 4: Verificación de Conexión (Ejecutar en Terminal)
-- psql -U backend_user -d airport_db -h 127.0.0.1
-- \l

-- Pregunta 5: Verificar Estructura de Tablas tras Migración Django
-- \dt
-- \d gestion_gate
-- \d gestion_flight

-- Pregunta 6: Crear Índice B-Tree en gestion_flight(status)
CREATE INDEX idx_flight_status ON gestion_flight(status);

-- Demostrar el uso del índice mediante EXPLAIN
EXPLAIN SELECT * FROM gestion_flight WHERE status = 'agendado';

-- Pregunta 7: Crear Vista vw_active_flights (Vuelos agendados o a bordo)
CREATE VIEW vw_active_flights AS
SELECT 
    f.id AS vuelo_id,
    f.flight_number,
    f.destination,
    f.status,
    g.code AS puerta_codigo,
    g.terminal
FROM gestion_flight f
JOIN gestion_gate g ON f.gate_id = g.id
WHERE f.status IN ('agendado', 'a_bordo');

-- Consulta de verificación sobre la vista
SELECT * FROM vw_active_flights;

-- Pregunta 8: Crear Función SQL para Contar Reservas/Vuelos por Estado
CREATE OR REPLACE FUNCTION fn_total_flights_by_status(p_status VARCHAR)
RETURNS BIGINT AS $$
    SELECT COUNT(*) FROM gestion_flight WHERE status = p_status;
$$ LANGUAGE sql;

-- Prueba funcional de la función
SELECT fn_total_flights_by_status('agendado') AS total_agendados;
