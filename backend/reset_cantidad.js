const pool = require('./config/db');

(async () => {
  try {
    // Reset cantidad_devuelta to allow a return
    await pool.query('UPDATE detalle_entrega SET cantidad_devuelta = 0 WHERE id = $1', [6]);
    console.log('Reset cantidad_devuelta for detalle_entrega id 6');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting cantidad_devuelta:', err);
    process.exit(1);
  }
})();
