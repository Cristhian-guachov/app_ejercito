const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const pool = require('../config/db');


// ======================================
// LOGIN
// ======================================

router.post('/login', async (req, res) => {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Usuario y contraseña requeridos'
            });
        }

        const usuarioTrim = String(usuario).trim();
        const passwordTrim = String(password).trim();

        // 1. Verificar en tabla usuarios (Administradores del sistema)
        const resultado = await pool.query(
            `
            SELECT * FROM usuarios
            WHERE usuario = $1
            `,
            [usuarioTrim]
        );

        if (resultado.rows.length > 0) {
            const usuarioBD = resultado.rows[0];
            const passwordValido = await bcrypt.compare(passwordTrim, usuarioBD.password);

            if (passwordValido) {
                return res.json({
                    success: true,
                    rol: 'admin',
                    usuario: usuarioBD.usuario,
                    mensaje: 'Login correcto como administrador'
                });
            }
        }

        // 2. Verificar en tabla personal (Personal Militar: usuario y password = cédula)
        const resultadoPersonal = await pool.query(
            `
            SELECT * FROM personal
            WHERE cedula = $1
            `,
            [usuarioTrim]
        );

        if (resultadoPersonal.rows.length > 0) {
            const militarBD = resultadoPersonal.rows[0];

            // La contraseña para personal militar es su número de cédula
            if (passwordTrim === militarBD.cedula.trim()) {
                if (militarBD.activo === false) {
                    return res.status(403).json({
                        success: false,
                        mensaje: 'Su registro militar se encuentra INACTIVO. Comuníquese con la administración.'
                    });
                }

                return res.json({
                    success: true,
                    rol: 'personal',
                    cedula: militarBD.cedula,
                    nombre: militarBD.nombre,
                    apellido: militarBD.apellido,
                    grado: militarBD.grado,
                    mensaje: `Bienvenido/a ${militarBD.grado} ${militarBD.nombre} ${militarBD.apellido}`
                });
            }
        }

        return res.status(401).json({
            success: false,
            mensaje: 'Credenciales incorrectas'
        });


    } catch (error) {

        console.log(error.message);

        res.status(500).json({

            mensaje: 'Error servidor'

        });

    }

});

module.exports = router;