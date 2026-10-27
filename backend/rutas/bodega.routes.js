const express = require('express');

const router = express.Router();

const pool = require('../config/db');


// ======================================
// GUARDAR INVENTARIO
// ======================================

router.post(

    '/guardar-bodega',

    async(req,res)=>{

        try{

            const {

                nombre_material,
                tipo_material,
                cantidad

            } = req.body;

            const verificar = await pool.query(

                `SELECT * FROM inventario
                WHERE nombre_material = $1`,

                [nombre_material]

            );

            if(verificar.rows.length > 0){

                return res.status(400).json({

                    mensaje:
                    'El material ya existe'

                });

            }

            await pool.query(

                `INSERT INTO inventario(

                    nombre_material,
                    tipo_material,
                    cantidad

                )

                VALUES($1,$2,$3)`,

                [

                    nombre_material,
                    tipo_material,
                    cantidad

                ]

            );

            res.json({

                mensaje:
                'Inventario guardado correctamente'

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// LISTAR INVENTARIO
// ======================================

router.get(

    '/listar-bodega',

    async(req,res)=>{

        try{

            const resultado = await pool.query(

                `SELECT *
                 FROM inventario
                 ORDER BY id DESC`

            );

            res.json(

                resultado.rows

            );

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// INVENTARIO PARA ENTREGAS
// ======================================

router.get(

    '/inventario',

    async(req,res)=>{

        try{

            const resultado = await pool.query(

                `SELECT
                    id,
                    nombre_material,
                    tipo_material,
                    cantidad
                 FROM inventario
                 ORDER BY nombre_material ASC`

            );

            res.json(

                resultado.rows

            );

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// BUSCAR INVENTARIO POR NOMBRE
// ======================================
router.get('/buscar-inventario', async (req, res) => {
    try {
        const { nombre } = req.query;
        const query = `
            SELECT * FROM inventario
            WHERE nombre_material ILIKE $1
            ORDER BY nombre_material ASC
        `;
        const resultado = await pool.query(query, [`%${nombre}%`]);
        res.json(resultado.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// BUSCAR MATERIAL POR ID
// ======================================

router.get(

    '/inventario/:id',

    async(req,res)=>{

        try{

            const { id } = req.params;

            const resultado = await pool.query(

                `SELECT *
                 FROM inventario
                 WHERE id = $1`,

                [id]

            );

            res.json(

                resultado.rows[0]

            );

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// ELIMINAR INVENTARIO
// ======================================

router.delete(

    '/eliminar-bodega/:id',

    async(req,res)=>{

        try{

            const { id } = req.params;

            await pool.query(

                `DELETE FROM inventario
                 WHERE id = $1`,

                [id]

            );

            res.json({

                mensaje:
                'Material eliminado correctamente'

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// ACTUALIZAR INVENTARIO (Sin modificar la cantidad directamente)
// ======================================

router.put(

    '/actualizar-bodega/:id',

    async(req,res)=>{

        try{

            const { id } = req.params;

            const {

                nombre_material,
                tipo_material

            } = req.body;

            await pool.query(

                `UPDATE inventario

                SET

                nombre_material = $1,
                tipo_material = $2

                WHERE id = $3`,

                [

                    nombre_material,
                    tipo_material,
                    id

                ]

            );

            res.json({

                mensaje:
                'Inventario actualizado'

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// AJUSTAR STOCK DE INVENTARIO E HISTORIAL
// ======================================

router.post(

    '/ajustar-inventario/:id',

    async(req,res)=>{

        try {

            const { id } = req.params;

            const { cantidad_nueva, motivo } = req.body;


            if (cantidad_nueva === undefined || cantidad_nueva === null || cantidad_nueva < 0) {

                return res.status(400).json({

                    mensaje: 'La cantidad nueva debe ser un número igual o mayor a 0'

                });

            }


            if (!motivo || motivo.trim() === '') {

                return res.status(400).json({

                    mensaje: 'El motivo del ajuste es obligatorio'

                });

            }


            // Iniciar transacción
            await pool.query('BEGIN');


            // Obtener el stock actual y el nombre del material
            const currentResult = await pool.query(

                'SELECT nombre_material, cantidad FROM inventario WHERE id = $1',

                [id]

            );


            if (currentResult.rows.length === 0) {

                await pool.query('ROLLBACK');

                return res.status(404).json({

                    mensaje: 'Material no encontrado'

                });

            }


            const currentItem = currentResult.rows[0];

            const cantidad_anterior = currentItem.cantidad;

            const nombre_material = currentItem.nombre_material;

            const diferencia = cantidad_nueva - cantidad_anterior;


            // Si la diferencia es 0, no hay cambios reales
            if (diferencia === 0) {

                await pool.query('ROLLBACK');

                return res.status(400).json({

                    mensaje: 'La nueva cantidad es idéntica a la cantidad actual'

                });

            }


            // Actualizar cantidad en la tabla inventario
            await pool.query(

                'UPDATE inventario SET cantidad = $1 WHERE id = $2',

                [cantidad_nueva, id]

            );


            // Insertar en la tabla historial_cambios_inventario
            await pool.query(

                `INSERT INTO historial_cambios_inventario 

                (inventario_id, nombre_material, cantidad_anterior, cantidad_nueva, diferencia, motivo)

                VALUES ($1, $2, $3, $4, $5, $6)`,

                [id, nombre_material, cantidad_anterior, cantidad_nueva, diferencia, motivo]

            );


            // Confirmar transacción
            await pool.query('COMMIT');


            res.json({

                success: true,

                mensaje: 'Stock de inventario ajustado y registrado correctamente'

            });


        } catch (error) {

            await pool.query('ROLLBACK');

            console.log(error);

            res.status(500).json({

                mensaje: 'Error al ajustar el inventario',

                error: error.message

            });

        }

    }

);


// ======================================
// LISTAR HISTORIAL DE CAMBIOS DE INVENTARIO
// ======================================

router.get(

    '/historial-inventario',

    async(req,res)=>{

        try {

            const resultado = await pool.query(

                `SELECT id, inventario_id, nombre_material, cantidad_anterior, cantidad_nueva, diferencia, motivo, fecha_cambio

                 FROM historial_cambios_inventario

                 ORDER BY fecha_cambio DESC`

            );

            res.json(resultado.rows);

        } catch (error) {

            console.log(error);

            res.status(500).json({

                mensaje: 'Error al obtener el historial de inventario',

                error: error.message

            });

        }

    }

);

module.exports = router;