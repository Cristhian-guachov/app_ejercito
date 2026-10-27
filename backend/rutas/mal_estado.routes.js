const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los materiales en mal estado
router.get('/mal-estado', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT id, devolucion_id, entrega_id, nombre_material, cantidad, fecha_registro
    FROM inventario_mal_estado
    ORDER BY fecha_registro DESC
  `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener materiales en mal estado:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos', error: error.message });
  }
});

module.exports = router;
