-- ============================================================
-- EXAMEN COMPLEXIVO - SECCIÓN 1: BASE DE DATOS RELACIONAL (POSTGRESQL)
-- Dominio: Caso Librería Online (Sistema Básico de Gestión de Catálogo y Pedidos)
-- ============================================================

-- Pregunta 1 & 2: Crear Base de Datos y Usuario
CREATE DATABASE bookstore_db;
CREATE USER backend_user WITH PASSWORD 'admin123';

-- Nota: Si tu examen especifica librerias_db y librerias_user:
-- CREATE DATABASE librerias_db OWNER librerias_user;
-- CREATE USER librerias_user WITH PASSWORD 'admin123';

-- Pregunta 3: Asignar Permisos Mínimos para Migraciones Django
GRANT ALL PRIVILEGES ON DATABASE bookstore_db TO backend_user;
\c bookstore_db
ALTER SCHEMA public OWNER TO backend_user;
GRANT ALL ON SCHEMA public TO backend_user;
GRANT CREATE ON SCHEMA public TO backend_user;

ALTER DEFAULT PRIVILEGES FOR USER backend_user IN SCHEMA public
GRANT ALL ON TABLES TO backend_user;

ALTER DEFAULT PRIVILEGES FOR USER backend_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO backend_user;

ALTER DEFAULT PRIVILEGES FOR USER backend_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO backend_user;

-- Pregunta 4: Verificación de Conexión (Ejecutar en Terminal)
-- psql -U backend_user -d bookstore_db -h 127.0.0.1
-- \l

-- Pregunta 5: Verificar Estructura de Tablas tras Migración Django
-- \dt
-- \d books
-- \d orders

-- Pregunta 6: Crear Índice B-Tree en orders(status)
CREATE INDEX idx_order_status ON orders(status);

-- Demostrar el uso del índice mediante EXPLAIN
EXPLAIN SELECT * FROM orders WHERE status = 'RECEIVED';

-- Pregunta 7: Crear Vista vw_pending_orders (Pedidos en estado RECEIVED o PACKING)
CREATE VIEW vw_pending_orders AS
SELECT 
    o.id AS order_id,
    o.customer_name,
    o.status,
    o.order_time,
    b.title AS book_title,
    b.isbn
FROM orders o
JOIN books b ON o.book_id = b.id
WHERE o.status IN ('RECEIVED', 'PACKING');

-- Consulta de verificación sobre la vista
SELECT * FROM vw_pending_orders;

-- Pregunta 8: Crear Función SQL para Contar Pedidos por Estado
CREATE OR REPLACE FUNCTION fn_total_orders_by_status(p_status VARCHAR)
RETURNS BIGINT AS $$
    SELECT COUNT(*) FROM orders WHERE status = p_status;
$$ LANGUAGE sql;

-- Prueba funcional de la función
SELECT fn_total_orders_by_status('RECEIVED') AS total_recibidos;
