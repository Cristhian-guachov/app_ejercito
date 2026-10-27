# Sistema de Gestión de Inventario y Entregas - Batallón de Logística N.º 73 "Girón"

Sistema web para el control de inventario de bodega, personal militar, actas de entrega, registro de devoluciones y generación de reportes en PDF.

---

## 🚀 Requisitos Previos

- **Node.js** (v18 o superior)
- **PostgreSQL** (v14 o superior)
- **Git**

---

## 🗄️ Base de Datos (PostgreSQL)

El proyecto incluye el volcado completo de la base de datos en el archivo [`database.sql`](./database.sql).

### Pasos para restaurar la base de datos:

1. Abrir la terminal o `psql` e iniciar sesión en PostgreSQL:
   ```bash
   psql -U postgres
   ```
2. Crear la base de datos si no existe:
   ```sql
   CREATE DATABASE ejercito_db;
   \q
   ```
3. Importar el archivo `database.sql`:
   ```bash
   psql -U postgres -d ejercito_db -f database.sql
   ```
*(O a través de **pgAdmin**: clic derecho sobre `ejercito_db` -> **Restore...** / **Query Tool** y ejecutar el contenido de `database.sql`).*

> **Nota de conexión:** Por defecto, el backend se conecta en `backend/config/db.js` con:
> - **Host**: `localhost`
> - **Port**: `5432`
> - **Database**: `ejercito_db`
> - **User**: `postgres`
> - **Password**: `123`

---

## 💻 Instalación y Ejecución

### 1. Backend (API Express)
```bash
cd backend
npm install
node server.js
```
El servidor backend se iniciará en `http://localhost:3000`.

### 2. Frontend (React + Vite)
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
El cliente frontend estará disponible en `http://localhost:5173`.
