const express = require('express');

const router = express.Router();

const pool = require('../config/db');


// ======================================
// GUARDAR PERSONAL
// ======================================

router.post(

    '/guardar-personal',

    async(req,res)=>{

        try{

            const {

                nombre,
                apellido,
                tipo_arma,
                grado,
                cedula,
                activo

            } = req.body;

            const verificar = await pool.query(

                'SELECT * FROM personal WHERE cedula = $1',

                [cedula]

            );

            if(verificar.rows.length > 0){

                return res.status(400).json({

                    mensaje:
                    'La cédula ya existe'

                });

            }

            const estadoActivo = activo !== undefined ? (activo === true || activo === 'true') : true;

            await pool.query(

                `INSERT INTO personal(

                    nombre,
                    apellido,
                    tipo_arma,
                    grado,
                    cedula,
                    activo

                )

                VALUES($1,$2,$3,$4,$5,$6)`,

                [

                    nombre,
                    apellido,
                    tipo_arma,
                    grado,
                    cedula,
                    estadoActivo

                ]

            );

            res.json({

                mensaje:
                'Personal registrado'

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// LISTAR PERSONAL
// ======================================

router.get(

    '/listar-personal',

    async(req,res)=>{

        try{

            const resultado = await pool.query(

                'SELECT * FROM personal ORDER BY activo DESC, nombre ASC'

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
// PERSONAL PARA ENTREGAS
// ======================================

router.get(

    '/personal',

    async(req,res)=>{

        try{

            const resultado = await pool.query(

                `SELECT

                    nombre,
                    apellido,
                    grado,
                    tipo_arma,
                    cedula,
                    activo

                FROM personal

                ORDER BY activo DESC, nombre ASC`

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
// BUSCAR PERSONAL POR CÉDULA
// ======================================

router.get(

    '/personal/:cedula',

    async(req,res)=>{

        try{

            const { cedula } = req.params;

            const resultado = await pool.query(

                'SELECT * FROM personal WHERE cedula = $1',

                [cedula]

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
// ELIMINAR PERSONAL
// ======================================

router.delete(

    '/eliminar-personal/:cedula',

    async(req,res)=>{

        try{

            const { cedula } = req.params;

            // Iniciar transacción
            await pool.query('BEGIN');

            // 1. Eliminar de detalle_entrega las filas referenciadas por entregas de esta cédula
            await pool.query(
                `DELETE FROM detalle_entrega 
                 WHERE entrega_id IN (SELECT id FROM entregas WHERE cedula = $1)`,
                [cedula]
            );

            // 2. Eliminar de entregas las filas asociadas a esta cédula
            await pool.query(
                'DELETE FROM entregas WHERE cedula = $1',
                [cedula]
            );

            // 3. Eliminar de personal
            await pool.query(

                'DELETE FROM personal WHERE cedula = $1',

                [cedula]

            );

            // Confirmar transacción
            await pool.query('COMMIT');

            res.json({

                mensaje:
                'Registro eliminado y entregas asociadas borradas'

            });

        }

        catch(error){

            // Revertir en caso de error
            await pool.query('ROLLBACK');

            console.log(error);

            res.status(500).json({
                mensaje: 'Error al eliminar el registro militar',
                error: error.message
            });

        }

    }

);


// ======================================
// ACTUALIZAR PERSONAL
// ======================================

router.put(

    '/actualizar-personal/:cedula',

    async(req,res)=>{

        try{

            const { cedula } = req.params;

            const {

                nombre,
                apellido,
                tipo_arma,
                grado,
                activo

            } = req.body;

            const estadoActivo = activo !== undefined ? (activo === true || activo === 'true') : true;

            await pool.query(

                `UPDATE personal

                SET

                nombre = $1,
                apellido = $2,
                tipo_arma = $3,
                grado = $4,
                activo = $5

                WHERE cedula = $6`,

                [

                    nombre,
                    apellido,
                    tipo_arma,
                    grado,
                    estadoActivo,
                    cedula

                ]

            );

            res.json({

                mensaje:
                'Registro actualizado'

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);


// ======================================
// CAMBIAR ESTADO (ACTIVO / INACTIVO)
// ======================================

router.patch(

    '/cambiar-estado-personal/:cedula',

    async(req,res)=>{

        try{

            const { cedula } = req.params;

            const { activo } = req.body;

            const estadoActivo = Boolean(activo === true || activo === 'true');

            await pool.query(

                'UPDATE personal SET activo = $1 WHERE cedula = $2',

                [estadoActivo, cedula]

            );

            res.json({

                mensaje: `Estado actualizado a ${estadoActivo ? 'Activo' : 'Inactivo'}`

            });

        }

        catch(error){

            console.log(error);

            res.status(500).json(error);

        }

    }

);

module.exports = router;