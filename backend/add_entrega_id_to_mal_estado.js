const pool = require('./config/db');

const sql = `
ALTER TABLE inventario_mal_estado 
ADD COLUMN IF NOT EXISTS entrega_id INT REFERENCES entregas(id) ON DELETE SET NULL;
`;

pool.query(sql)
    .then(() => {
        console.log('Columna entrega_id añadida a inventario_mal_estado correctamente.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error al añadir columna entrega_id:', err);
        process.exit(1);
    });
