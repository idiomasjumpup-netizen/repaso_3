// ============================================================
// EXAMEN COMPLEXIVO - SECCIÓN 2: BASE DE DATOS NO RELACIONAL (MONGODB)
// Dominio Rebrandeado: Sistema de Gestión Aeroportuaria (Airport System)
// ============================================================

// Pregunta 1: Definir / Seleccionar Base de Datos
use airport_logs;

// Pregunta 2 & 3: Crear Usuario mongo_backend_user y Asignar Roles Mínimos
db.createUser({
  user: "mongo_backend_user",
  pwd: "exa_2026_ute",
  roles: [
    { role: "readWrite", db: "airport_logs" }
  ]
});

// Pregunta 4: Probar Autenticación
db.auth("mongo_backend_user", "exa_2026_ute");

// Pregunta 5: Crear Colecciones e Inserción de Prueba
db.createCollection("airlines");
db.createCollection("flight_events");

db.airlines.insertOne({
  name: "Avianca",
  code: "AV",
  country: "Colombia",
  is_active: true,
  created_at: new Date()
});

db.flight_events.insertOne({
  flight_id: 1,
  airline_id: "AV",
  event_type: "creado",
  source: "web",
  note: "Acta de vuelo inicial registrada en el sistema aeroportuario",
  created_at: new Date()
});

// Pregunta 6: Crear Índice en flight_events(flight_id) y Evidenciar con getIndexes()
db.flight_events.createIndex({ flight_id: 1 });
db.flight_events.getIndexes();

// Pregunta 7: Consulta 1 - Eventos/Actas por flight_id
db.flight_events.find({ flight_id: 1 });

// Pregunta 7: Consulta 2 - Eventos/Actas por Rango de Fechas (created_at)
db.flight_events.find({
  created_at: {
    $gte: ISODate("2026-01-01T00:00:00Z"),
    $lte: ISODate("2026-12-31T23:59:59Z")
  }
});
