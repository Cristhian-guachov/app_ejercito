const pool = require('./config/db');

const sql = `
CREATE TABLE IF NOT EXISTS historial_cambios_inventario (
    id SERIAL PRIMARY KEY,
    inventario_id INT REFERENCES inventario(id) ON DELETE CASCADE,
    nombre_material VARCHAR(255) NOT NULL,
    cantidad_anterior INT NOT NULL,
    cantidad_nueva INT NOT NULL,
    diferencia INT NOT NULL,
    motivo TEXT NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(sql)
    .then(() => {
        console.log('Tabla historial_cambios_inventario creada con éxito.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error al crear la tabla:', err);
        process.exit(1);
    });
