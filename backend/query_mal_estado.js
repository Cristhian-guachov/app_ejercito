const pool = require('./config/db');

(async () => {
  try {
    const res = await pool.query('SELECT * FROM inventario_mal_estado WHERE devolucion_id = $1', [36]);
    console.log('Rows:', res.rows);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
})();
