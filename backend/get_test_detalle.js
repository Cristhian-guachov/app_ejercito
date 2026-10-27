const pool = require('./config/db');

pool.query('SELECT id FROM detalle_entrega LIMIT 1')
  .then(res => {
    if (res.rows.length === 0) {
      console.log('No hay detalle_entrega en la base de datos.');
    } else {
      console.log('Detalle_entrega id:', res.rows[0].id);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error al consultar detalle_entrega:', err);
    process.exit(1);
  });
