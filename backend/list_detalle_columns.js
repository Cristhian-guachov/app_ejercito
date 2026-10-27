const pool = require('./config/db');

pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'detalle_entrega'`)
  .then(res => {
    console.log('Columns in detalle_entrega:', res.rows.map(r => r.column_name).join(', '));
    process.exit(0);
  })
  .catch(err => {
    console.error('Error fetching columns:', err);
    process.exit(1);
  });
