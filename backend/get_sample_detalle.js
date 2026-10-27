const pool = require('./config/db');

pool.query('SELECT id, entrega_id, cantidad, cantidad_devuelta FROM detalle_entrega LIMIT 1')
  .then(res => {
    if (res.rows.length === 0) {
      console.log('No hay detalle_entrega en la base de datos.');
    } else {
      console.log('Detalle:', res.rows[0]);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error al consultar detalle_entrega:', err);
    process.exit(1);
  });
