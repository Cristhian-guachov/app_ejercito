const pool = require('./config/db');
pool.query('SELECT id, entrega_id, cantidad, cantidad_devuelta FROM detalle_entrega ORDER BY id LIMIT 20')
  .then(res => {
    console.log('Detalle entrega rows:', res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error fetching detalle_entrega:', err);
    process.exit(1);
  });
