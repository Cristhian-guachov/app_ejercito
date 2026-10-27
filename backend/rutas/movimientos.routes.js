const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/movimientos - devuelve historial de movimientos (entregas y devoluciones)
router.get('/movimientos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.fecha_entrega AS fecha,
        'ENTREGA' AS tipo,
        p.grado,
        p.nombre,
        p.apellido,
        p.cedula,
        i.nombre_material,
        d.cantidad,
        e.observaciones
      FROM entregas e
      INNER JOIN personal p ON e.cedula = p.cedula
      INNER JOIN detalle_entrega d ON e.id = d.entrega_id
      INNER JOIN inventario i ON d.inventario_id = i.id
      UNION ALL
      SELECT 
        dev.fecha_devolucion AS fecha,
        'DEVOLUCION' AS tipo,
        p.grado,
        p.nombre,
        p.apellido,
        p.cedula,
        i.nombre_material,
        dev.cantidad_devuelta AS cantidad,
        dev.causa AS observaciones
      FROM devoluciones dev
      INNER JOIN detalle_entrega d ON dev.detalle_entrega_id = d.id
      INNER JOIN entregas e ON d.entrega_id = e.id
      INNER JOIN personal p ON e.cedula = p.cedula
      INNER JOIN inventario i ON d.inventario_id = i.id
      ORDER BY fecha DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos.' });
  }
});

module.exports = router;
