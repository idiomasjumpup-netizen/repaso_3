# Guia de Inicializacion y Ejecucion de Proyectos (Ubuntu)

Esta guia contiene los comandos para inicializar y ejecutar los 3 componentes del sistema en Ubuntu Linux: Backend (API Django REST), Frontend (Web React/Vite) y Movil (App Movil React Native Expo).

---

## 1. Backend API (`backend`)

### Paso 1: Configurar la Base de Datos (PostgreSQL)
```sql
CREATE USER backend_user WITH PASSWORD 'admin123';
CREATE DATABASE airport_db OWNER backend_user;

\c airport_db

ALTER SCHEMA public OWNER TO backend_user;
GRANT ALL ON SCHEMA public TO backend_user;
```

### Paso 2: Configurar Entorno e Instalar Dependencias
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv pymongo
```

### Paso 3: Configurar Archivo .env
Crear el archivo `backend/.env` con la siguiente configuracion:

```env
DEBUG=1
SECRET_KEY=dev-secret-key
DB_NAME=airport_db
DB_USER=backend_user
DB_PASSWORD=admin123
DB_HOST=127.0.0.1
DB_PORT=5432
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=airport_logs
CORS_ORIGIN=http://localhost:5173
```

### Paso 4: Ejecutar Migraciones y Servidor
```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver 0.0.0.0:8000
```

---

## 2. Web UI (`frontend`)

### Paso 1: Navegar e Instalar Dependencias
```bash
cd frontend
npm install
```

### Paso 2: Configurar Variables de Entorno (.env)
Crear el archivo `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Paso 3: Iniciar Servidor de Desarrollo
```bash
npm run dev
```

---

## 3. Mobile App React Native (`movil`)

### Paso 1: Navegar e Instalar Dependencias
```bash
cd movil
npm install
```

### Paso 2: Iniciar Expo
```bash
npm start
```

---

## Resumen de Comandos en 3 Terminales de Ubuntu

### Terminal 1 (Backend - API)
```bash
cd backend
python3 manage.py runserver 0.0.0.0:8000
```

### Terminal 2 (Frontend - Web UI)
```bash
cd frontend
npm run dev
```

### Terminal 3 (Movil - App React Native)
```bash
cd movil
npm start
```
