const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/pedidos - devuelve listado de pedidos (entregas)
router.get('/pedidos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id AS entrega_id,
        e.fecha_entrega,
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
      ORDER BY e.fecha_entrega DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos.' });
  }
});

module.exports = router;
