// ============================================================
// EXAMEN COMPLEXIVO - SECCIÓN 2: BASE DE DATOS NO RELACIONAL (MONGODB)
// Dominio: Caso Librería Online (Sistema Básico de Gestión de Catálogo y Pedidos)
// ============================================================

// Pregunta 1: Definir / Seleccionar Base de Datos
use bookstore_logs;

// Pregunta 2 & 3: Crear Usuario mongo_backend_user y Asignar Roles Mínimos
db.createUser({
  user: "mongo_backend_user",
  pwd: "exa_2026_ute",
  roles: [
    { role: "readWrite", db: "bookstore_logs" }
  ]
});

// Pregunta 4: Probar Autenticación
db.auth("mongo_backend_user", "exa_2026_ute");

// Pregunta 5: Crear Colecciones e Inserción de Prueba
db.createCollection("publishers");
db.createCollection("shipping_labels");

db.publishers.insertOne({
  name: "Editorial Planeta",
  code: "PLA",
  country: "Ecuador",
  is_active: true,
  created_at: new Date()
});

db.shipping_labels.insertOne({
  order_id: 1,
  carrier: "SERVIENTREGA",
  tracking_number: "TRK-000001",
  address: "Av. Amazonas y Colón, Quito",
  estimated_delivery: new Date(Date.now() + 3*24*60*60*1000),
  created_at: new Date()
});

// Pregunta 6: Crear Índice en shipping_labels(order_id) y Evidenciar con getIndexes()
db.shipping_labels.createIndex({ order_id: 1 });
db.shipping_labels.getIndexes();

// Pregunta 7: Consulta 1 - Guías por order_id
db.shipping_labels.find({ order_id: 1 });

// Pregunta 7: Consulta 2 - Guías por Rango de Fechas (created_at)
db.shipping_labels.find({
  created_at: {
    $gte: ISODate("2026-01-01T00:00:00Z"),
    $lte: ISODate("2026-12-31T23:59:59Z")
  }
});
