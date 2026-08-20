# Guía Completa de Evidencias (Capturas 1 a 30) - Examen Complexivo Práctico
## Dominio: Caso Librería Online (Sistema Básico de Gestión de Catálogo y Pedidos)

Este documento contiene la guía paso a paso y los comandos para Ubuntu para generar las 30 capturas de pantalla requeridas para el examen complexivo práctico.

---

> [!IMPORTANT]
> **REGLAS PARA TODAS LAS CAPTURAS:**
> 1. **Fecha y hora del sistema siempre visible** en el escritorio de Ubuntu.
> 2. **Captura de pantalla completa** de la ventana de la terminal de Ubuntu, navegador o Postman.
> 3. **Mantener la numeración consecutiva** del 1 al 30.

---

# SECCIÓN 1: BASE DE DATOS RELACIONAL (POSTGRESQL)

### Captura 1 – Creación de Base de Datos
* **Objetivo:** Mostrar en la terminal de Ubuntu la creación exitosa de la base de datos `bookstore_db` (o `librerias_db`).
* **Comando a ejecutar en psql:**
  ```sql
  CREATE DATABASE bookstore_db;
  ```
* **Qué evidenciar:** El mensaje `CREATE DATABASE` indicando que la base de datos se creó correctamente.

---

### Captura 2 – Creación de Usuario y Asignación de Permisos
* **Objetivo:** Mostrar los comandos para crear el usuario `backend_user` (o `librerias_user`) y concederle privilegios mínimos.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE USER backend_user WITH PASSWORD 'admin123';
  GRANT ALL PRIVILEGES ON DATABASE bookstore_db TO backend_user;
  \c bookstore_db
  ALTER SCHEMA public OWNER TO backend_user;
  GRANT ALL ON SCHEMA public TO backend_user;
  ```
* **Qué evidenciar:** Las salidas `CREATE ROLE`, `GRANT` y `ALTER SCHEMA`.

---

### Captura 3 – Conexión con el Usuario Creado
* **Objetivo:** Iniciar sesión con el usuario `backend_user` en la BD `bookstore_db` y listar las bases de datos.
* **Comando a ejecutar en la terminal de Ubuntu:**
  ```bash
  psql -U backend_user -d bookstore_db -h 127.0.0.1
  ```
* **Dentro de psql:**
  ```sql
  \l
  ```
* **Qué evidenciar:** El prompt de la terminal mostrando `bookstore_db=>` y el listado de bases de datos.

---

### Captura 4 – Tablas Generadas por Migración
* **Objetivo:** Mostrar el listado de tablas creadas tras ejecutar las migraciones de Django.
* **Comando a ejecutar en psql:**
  ```sql
  \dt
  ```
* **Qué evidenciar:** El listado de tablas creadas (`books`, `orders`, `django_migrations`).

---

### Captura 5 – Estructura de Tablas
* **Objetivo:** Mostrar la estructura detallada y tipos de datos de las dos tablas principales.
* **Comandos a ejecutar en psql:**
  ```sql
  \d books
  \d orders
  ```
* **Qué evidenciar:** Las columnas, tipos de datos (`character varying`, `boolean`, `integer`, `timestamp with time zone`), PK y FK (`book_id`).

---

### Captura 6 – Creación de Índice
* **Objetivo:** Mostrar la creación de un índice b-tree en `orders(status)` y su verificación con `EXPLAIN`.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE INDEX idx_order_status ON orders(status);
  EXPLAIN SELECT * FROM orders WHERE status = 'RECEIVED';
  ```
* **Qué evidenciar:** La respuesta `CREATE INDEX` y el plan de ejecución `EXPLAIN`.

---

### Captura 7 – Creación de Vista
* **Objetivo:** Mostrar la creación de la vista `vw_pending_orders` (pedidos en `RECEIVED` o `PACKING`) y una consulta SELECT.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE VIEW vw_pending_orders AS
  SELECT o.id AS order_id, o.customer_name, o.status, o.order_time, b.title AS book_title, b.isbn
  FROM orders o
  JOIN books b ON o.book_id = b.id
  WHERE o.status IN ('RECEIVED', 'PACKING');

  SELECT * FROM vw_pending_orders;
  ```
* **Qué evidenciar:** El mensaje `CREATE VIEW` y el resultado de la consulta.

---

### Captura 8 – Función o Trigger
* **Objetivo:** Crear y probar una función SQL para contar pedidos por estado.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE OR REPLACE FUNCTION fn_total_orders_by_status(p_status VARCHAR)
  RETURNS BIGINT AS $$
      SELECT COUNT(*) FROM orders WHERE status = p_status;
  $$ LANGUAGE sql;

  SELECT fn_total_orders_by_status('RECEIVED') AS total_recibidos;
  ```
* **Qué evidenciar:** La salida `CREATE FUNCTION` y el valor numérico de la consulta.

---

# SECCIÓN 2: BASE DE DATOS NO RELACIONAL (MONGODB)

### Captura 9 – Creación y Selección de Base de Datos
* **Objetivo:** Iniciar `mongosh` en Ubuntu y seleccionar la BD `bookstore_logs`.
* **Comandos:**
  ```bash
  mongosh
  use bookstore_logs
  ```
* **Qué evidenciar:** `switched to db bookstore_logs`.

---

### Captura 10 – Creación de Usuario
* **Objetivo:** Crear `mongo_backend_user` con contraseña `exa_2026_ute` y roles de lectura/escritura.
* **Comando:**
  ```javascript
  db.createUser({
    user: "mongo_backend_user",
    pwd: "exa_2026_ute",
    roles: [ { role: "readWrite", db: "bookstore_logs" } ]
  })
  ```
* **Qué evidenciar:** `{ ok: 1 }`.

---

### Captura 11 – Creación o Verificación de Colecciones
* **Objetivo:** Mostrar colecciones `publishers` y `shipping_labels` con inserción de prueba.
* **Comandos:**
  ```javascript
  db.createCollection("publishers")
  db.createCollection("shipping_labels")
  db.publishers.insertOne({ name: "Editorial Planeta", code: "PLA", country: "Ecuador", is_active: true, created_at: new Date() })
  show collections
  ```
* **Qué evidenciar:** Confirmación de inserción y listado de colecciones.

---

### Captura 12 – Creación de Índice
* **Objetivo:** Crear un índice en `shipping_labels(order_id)` y evidenciar con `getIndexes()`.
* **Comandos:**
  ```javascript
  db.shipping_labels.createIndex({ order_id: 1 })
  db.shipping_labels.getIndexes()
  ```
* **Qué evidenciar:** El índice `order_id_1` en el arreglo devuelto.

---

### Captura 13 – Consulta por Identificador
* **Objetivo:** Filtrar guías de envío por el identificador de pedido SQL `order_id`.
* **Comando:**
  ```javascript
  db.shipping_labels.find({ order_id: 1 })
  ```
* **Qué evidenciar:** El documento devuelto con el campo `order_id: 1`.

---

### Captura 14 – Consulta por Rango de Fechas
* **Objetivo:** Filtrar guías por el campo de fecha `created_at`.
* **Comando:**
  ```javascript
  db.shipping_labels.find({
    created_at: {
      $gte: ISODate("2026-01-01T00:00:00Z"),
      $lte: ISODate("2026-12-31T23:59:59Z")
    }
  })
  ```
* **Qué evidenciar:** Documentos que coincidan dentro del rango de fechas.

---

# SECCIÓN 3: BACKEND – DJANGO REST

### Captura 15 – Creación del Proyecto y Aplicación
* **Objetivo:** Mostrar la estructura del proyecto Django `backend` y la app `gestion`.
* **Comandos:**
  ```bash
  cd backend
  tree -L 2 .
  ls -la gestion/
  ```
* **Qué evidenciar:** La estructura de directorios con `manage.py`, `config/` y `gestion/`.

---

### Captura 16 – Migraciones Ejecutadas
* **Objetivo:** Mostrar ejecución de makemigrations y migrate.
* **Comandos:**
  ```bash
  python3 manage.py makemigrations
  python3 manage.py migrate
  ```
* **Qué evidenciar:** La salida `Applying gestion.0001_initial... OK`.

---

### Captura 17 – Servidor en Ejecución
* **Objetivo:** Servidor backend activo en puerto 8000.
* **Comando:**
  ```bash
  python3 manage.py runserver 0.0.0.0:8000
  ```
* **Qué evidenciar:** `Starting development server at http://0.0.0.0:8000/`.

---

### Captura 18 – Endpoint GET Funcional
* **Objetivo:** GET al endpoint `/api/orders/` o `/api/books/`.
* **URL:** `http://127.0.0.1:8000/api/orders/`
* **Qué evidenciar:** Respuesta HTTP 200 OK con JSON.

---

### Captura 19 – Endpoint POST Funcional (Con Integración NoSQL)
* **Objetivo:** Crear un nuevo pedido vía POST en SQL y evidenciar la generación automática de la guía NoSQL en Mongo.
* **URL:** `http://127.0.0.1:8000/api/orders/` (POST)
* **Body (JSON):**
  ```json
  {
    "book": 1,
    "customer_name": "Juan Pérez",
    "status": "RECEIVED",
    "order_time": "2026-08-20T18:00:00Z"
  }
  ```
* **Qué evidenciar:** Estado `201 Created` y el objeto registrado.

---

# SECCIÓN 4: FRONTEND – REACTJS

### Captura 20 – Proyecto React en Ejecución
* **Objetivo:** Terminal de Ubuntu con servidor de desarrollo activo.
* **Comandos:**
  ```bash
  cd frontend
  npm run dev
  ```
* **Qué evidenciar:** `Local: http://localhost:5173/`.

---

### Captura 21 – Listado de Registros
* **Objetivo:** Interfaz web en navegador consumiendo GET `/api/books/` y `/api/orders/`.
* **URL:** `http://localhost:5173/`
* **Qué evidenciar:** La lista de libros y pedidos consumidos desde Django.

---

### Captura 22 – Registro Nuevo Desde la Interfaz
* **Objetivo:** Crear un nuevo pedido desde la web y actualizar el listado.
* **Qué evidenciar:** Formulario completado y tabla con el registro actualizado.

---

# SECCIÓN 5: APLICACIÓN MÓVIL – REACT NATIVE

### Captura 23 – Proyecto Móvil Creado
* **Objetivo:** Terminal con Expo activo en la carpeta `movil`.
* **Comandos:**
  ```bash
  cd movil
  npm start
  ```
* **Qué evidenciar:** Metro Bundler / Expo inicializado.

---

### Captura 24 – Aplicación Ejecutándose
* **Objetivo:** Pantalla principal de la app móvil renderizada.
* **Qué evidenciar:** Interfaz de la app en emulador o dispositivo.

---

### Captura 25 – Consumo de API NoSQL
* **Objetivo:** Mostrar la lista de editoriales (`publishers`) y guías de envío (`shipping_labels`) desde MongoDB.
* **Qué evidenciar:** Datos NoSQL visibles en las listas de la app móvil.

---

# SECCIÓN 6: SISTEMAS OPERATIVOS – UBUNTU (MÁQUINA VIRTUAL)

### Captura 26 – Creación de Estructura de Directorios
* **Objetivo:** Crear carpeta `examen`, subcarpeta `libreria` y carpetas `backend`, `frontend`, `movil`, `docs`.
* **Comandos:**
  ```bash
  mkdir -p examen/libreria/{backend,frontend,movil,docs}
  cd examen
  tree libreria
  ```
* **Qué evidenciar:** Estructura en árbol con las 4 carpetas dentro de `libreria`.

---

### Captura 27 – Navegación y Listado
* **Objetivo:** Entrar a `libreria`, verificar ruta con `pwd` y listar detalles con `ls -la`.
* **Comandos:**
  ```bash
  cd libreria
  pwd
  ls -la
  ```
* **Qué evidenciar:** Ruta `/home/usuario/examen/libreria` y listado de `ls -la`.

---

### Captura 28 – Creación de Archivos y Redirección de Salida
* **Objetivo:** Crear `comandos.txt` y `evidencia.txt` en `docs`, registrar fecha con `date >>`, guardar `who` y `ls -la` con `>` y `>>`.
* **Comandos:**
  ```bash
  cd docs
  touch comandos.txt evidencia.txt
  date >> evidencia.txt
  cat evidencia.txt
  who > comandos.txt
  ls -la >> comandos.txt
  cat comandos.txt
  ```
* **Qué evidenciar:** Fecha en `evidencia.txt` y contenido de `comandos.txt`.

---

### Captura 29 – Búsqueda con grep y Localización de Archivo
* **Objetivo:** Escribir el log del servicio en `comandos.txt`, buscar la palabra `order` con `grep` y `grep -n`, y localizar `README.md` con `find`.
* **Comandos:**
  ```bash
  cat << 'EOF' > comandos.txt
  Proyecto Librería Online - Backend
  GET /api/orders/
  GET /api/orders/21/
  POST /api/orders/
  DELETE /api/orders/7/
  INFO: order created successfully
  INFO: orders service running
  WARN: order delay detected
  EOF

  grep "order" comandos.txt
  grep -n "order" comandos.txt

  touch ../backend/README.md
  cd ..
  find . -name "README.md"
  ```
* **Qué evidenciar:** Resaltado de `order`, números de línea con `grep -n` y ruta `./backend/README.md` con `find`.

---

### Captura 30 – Copiar, Mover, Permisos y Sticky Bit
* **Objetivo:** Copiar y mover respaldos de evidencia, y aplicar el Sticky Bit (`1777`) a la carpeta `shared`.
* **Comandos:**
  ```bash
  cp docs/evidencia.txt docs/evidencia_backup.txt
  mv docs/evidencia_backup.txt backend/
  ls -la backend/

  ls -ld docs
  mkdir shared
  chmod 1777 shared
  ls -ld shared
  ```
* **Qué evidenciar:** `evidencia_backup.txt` en `backend/` y los permisos `drwxrwxrwt` para `shared`.
