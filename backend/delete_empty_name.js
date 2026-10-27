const pool = require('./config/db');

(async () => {
    try {
        const result = await pool.query(
            "DELETE FROM inventario WHERE nombre_material IS NULL OR TRIM(nombre_material) = ''"
        );
        console.log(`✅ Registros eliminados: ${result.rowCount}`);
    } catch (err) {
        console.error('❌ Error al eliminar registros:', err.message);
    } finally {
        await pool.end();
    }
})();
