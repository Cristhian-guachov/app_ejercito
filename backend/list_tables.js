const pool = require('./config/db');
(async () => {
  try {
    const res = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('Número de tablas:', res.rows.length);
    console.log('Tablas:', res.rows.map(r => r.tablename).join(', '));
  } catch (err) {
    console.error('Error al obtener tablas:', err);
  } finally {
    await pool.end();
  }
})();
