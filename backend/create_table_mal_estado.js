const pool = require('./config/db');

const sql = `
CREATE TABLE IF NOT EXISTS inventario_mal_estado (
    id SERIAL PRIMARY KEY,
    devolucion_id INT REFERENCES devoluciones(id) ON DELETE CASCADE,
    nombre_material VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(sql)
    .then(() => {
        console.log('Tabla inventario_mal_estado creada con éxito.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error al crear la tabla:', err);
        process.exit(1);
    });
