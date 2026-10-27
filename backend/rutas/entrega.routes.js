const express = require("express");

const router = express.Router();

const pool = require("../config/db");

// ======================================
// PRUEBA
// ======================================

router.get("/prueba-entrega", (req, res) => {

    res.json({

        mensaje: "Ruta entrega funcionando"

    });

});

// ======================================
// LISTAR PERSONAL
// ======================================

router.get("/personal", async (req, res) => {

    try {

        const resultado = await pool.query(

            `
            SELECT *
            FROM personal
            ORDER BY nombre ASC
            `

        );

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: "Error al obtener personal"

        });

    }

});

// ======================================
// LISTAR INVENTARIO
// ======================================

router.get("/inventario", async (req, res) => {

    try {

        const resultado = await pool.query(

            `
            SELECT *
            FROM inventario
            ORDER BY nombre_material ASC
            `

        );

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: "Error al obtener inventario"

        });

    }

});

// ======================================
// REGISTRAR ENTREGA
// ======================================

router.post("/entregas", async (req, res) => {

    const {

        cedula,
        observaciones,
        materiales

    } = req.body;

    try {

        // Iniciar transacción
        await pool.query('BEGIN');

        // 1. Validar stock para todos los materiales
        for (const material of materiales) {

            const result = await pool.query(

                'SELECT nombre_material, cantidad FROM inventario WHERE id = $1',

                [material.inventario_id]

            );

            if (result.rows.length === 0) {

                await pool.query('ROLLBACK');

                return res.status(404).json({

                    mensaje: 'Material no encontrado en inventario'

                });

            }

            const item = result.rows[0];

            if (Number(item.cantidad) < Number(material.cantidad)) {

                await pool.query('ROLLBACK');

                return res.status(400).json({

                    mensaje: `No se encuentra la cantidad suficiente de ${item.nombre_material}. Disponible: ${item.cantidad}, Solicitado: ${material.cantidad}`

                });

            }

        }

        // 2. Registrar el pedido principal (entrega)
        const entrega = await pool.query(

            `
            INSERT INTO entregas
            (
                cedula,
                observaciones
            )
            VALUES
            ($1,$2)
            RETURNING id, fecha_entrega
            `,

            [

                cedula,
                observaciones

            ]

        );

        const entregaId = entrega.rows[0].id;
        const fechaEntrega = entrega.rows[0].fecha_entrega;

        // 3. Registrar los detalles y restar stock
        for (const material of materiales) {

            await pool.query(

                `
                INSERT INTO detalle_entrega
                (
                    entrega_id,
                    inventario_id,
                    cantidad
                )
                VALUES
                ($1,$2,$3)
                `,

                [

                    entregaId,
                    material.inventario_id,
                    material.cantidad

                ]

            );

            await pool.query(

                `
                UPDATE inventario
                SET cantidad = cantidad - $1
                WHERE id = $2
                `,

                [

                    material.cantidad,
                    material.inventario_id

                ]

            );

        }

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.json({

            mensaje: "Pedido registrado correctamente",
            entregaId: entregaId,
            fecha_entrega: fechaEntrega

        });


    } catch (error) {

        await pool.query('ROLLBACK');

        console.log(error);

        res.status(500).json({

            mensaje: "Error al registrar el pedido",

            error: error.message

        });

    }

});

// ======================================
// HISTORIAL DE ENTREGAS
// ======================================

router.get("/historial-entregas", async (req, res) => {

    try {

        const { cedula } = req.query;

        let query = `
            SELECT

            e.id AS entrega_id,
            d.id AS detalle_id,
            e.fecha_entrega,
            e.observaciones,

            p.cedula,
            p.nombre,
            p.apellido,
            p.grado,

            i.id AS inventario_id,
            i.nombre_material,

            d.cantidad,
            d.cantidad_devuelta

            FROM entregas e

            INNER JOIN personal p
            ON e.cedula = p.cedula

            INNER JOIN detalle_entrega d
            ON e.id = d.entrega_id

            INNER JOIN inventario i
            ON d.inventario_id = i.id
        `;

        const params = [];
        if (cedula && String(cedula).trim() !== "") {
            query += ` WHERE p.cedula = $1 `;
            params.push(String(cedula).trim());
        }

        query += ` ORDER BY e.id DESC `;

        const resultado = await pool.query(query, params);

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: "Error al obtener historial"

        });

    }

});

// ======================================
// REGISTRAR DEVOLUCIÓN DE PRODUCTO
// ======================================
router.post("/devoluciones", async (req, res) => {

    const { detalle_entrega_id, cantidad_devuelta, causa } = req.body;


    if (!detalle_entrega_id || cantidad_devuelta === undefined || cantidad_devuelta <= 0) {

        return res.status(400).json({

            mensaje: "Datos de devolución inválidos."

        });

    }


    if (!causa || causa.trim() === "") {

        return res.status(400).json({

            mensaje: "El estado o causa en la que llegó el producto es obligatorio."

        });

    }


    try {

        // Iniciar transacción
        await pool.query("BEGIN");


        // 1. Obtener detalles del registro original
        const result = await pool.query(
    
        "SELECT cantidad, cantidad_devuelta, inventario_id, entrega_id FROM detalle_entrega WHERE id = $1",
    
        [detalle_entrega_id]
    );


        if (result.rows.length === 0) {

            await pool.query("ROLLBACK");

            return res.status(404).json({

                mensaje: "Detalle de pedido no encontrado."

            });

        }


        const detalle = result.rows[0];

        const cantidadPedida = detalle.cantidad;

        const cantidadYaDevuelta = detalle.cantidad_devuelta;

        const inventarioId = detalle.inventario_id;


        // Validar que la devolución no supere lo restante por devolver
        const limiteDisponible = cantidadPedida - cantidadYaDevuelta;

        if (Number(cantidad_devuelta) > limiteDisponible) {

            await pool.query("ROLLBACK");

            return res.status(400).json({

                mensaje: `La cantidad a devolver (${cantidad_devuelta}) supera la cantidad disponible por devolver (${limiteDisponible}).`

            });

        }


        // 2. Incrementar la cantidad devuelta en el detalle
        await pool.query(
            "UPDATE detalle_entrega SET cantidad_devuelta = cantidad_devuelta + $1 WHERE id = $2",
            [cantidad_devuelta, detalle_entrega_id]
        );

        // 3. Registrar la devolución en la tabla devoluciones
        const devResult = await pool.query(
            `INSERT INTO devoluciones (detalle_entrega_id, cantidad_devuelta, causa)
             VALUES ($1, $2, $3)
             RETURNING id, fecha_devolucion, causa, cantidad_devuelta`,
            [detalle_entrega_id, cantidad_devuelta, causa]
        );
        const devolucionId = devResult.rows[0].id;

        // 4. Controlar estado del material: si es "Mal estado", registrar en inventario_mal_estado, de lo contrario reintegrar a inventario general
        const esMalEstado = causa.trim() === "Mal estado";
        
        if (!esMalEstado) {
            // Devolver el stock al inventario general
            await pool.query(
                "UPDATE inventario SET cantidad = cantidad + $1 WHERE id = $2",
                [cantidad_devuelta, inventarioId]
            );
        } else {
            // Obtener el nombre del material para registrarlo en el inventario de mal estado
            const matResult = await pool.query(
                "SELECT nombre_material FROM inventario WHERE id = $1",
                [inventarioId]
            );
            const nombreMaterial = matResult.rows[0].nombre_material;

            // Almacenar en el inventario de materiales en mal estado
            await pool.query(
    `INSERT INTO inventario_mal_estado (devolucion_id, entrega_id, nombre_material, cantidad)
     VALUES ($1, $2, $3, $4)`,
    [devolucionId, detalle.entrega_id, nombreMaterial, cantidad_devuelta]
);
        }

        // Confirmar transacción
        await pool.query("COMMIT");

        res.json({
            success: true,
            mensaje: esMalEstado 
                ? "Devolución en mal estado registrada y guardada en inventario de baja." 
                : "Devolución registrada con éxito, stock de inventario general actualizado.",
            devolucion: devResult.rows[0]
        });


    } catch (error) {

        await pool.query("ROLLBACK");

        console.error(error);

        res.status(500).json({

            mensaje: "Error al registrar la devolución.",

            error: error.message

        });

    }

});

// ======================================
// OBTENER DEVOLUCIONES DE UN DETALLE
// ======================================
router.get("/devoluciones/detalle/:detalle_id", async (req, res) => {
    const { detalle_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id, cantidad_devuelta, causa, fecha_devolucion
             FROM devoluciones
             WHERE detalle_entrega_id = $1
             ORDER BY fecha_devolucion DESC`,
            [detalle_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener historial de devoluciones",
            error: error.message
        });
    }
});

// ======================================
// OBTENER DEVOLUCIONES POR ENTREGA
// ======================================
router.get("/devoluciones/entrega/:entrega_id", async (req, res) => {
    const { entrega_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT d.id AS detalle_id,
                    i.nombre_material,
                    dev.cantidad_devuelta,
                    dev.causa,
                    dev.fecha_devolucion
             FROM detalle_entrega d
             JOIN entregas e ON d.entrega_id = e.id
             JOIN inventario i ON d.inventario_id = i.id
             JOIN devoluciones dev ON dev.detalle_entrega_id = d.id
             WHERE e.id = $1
             ORDER BY dev.fecha_devolucion DESC`,
            [entrega_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener devoluciones por entrega", error: error.message });
    }
});
// ======================================
// ELIMINAR PEDIDO / DETALLE CON RESTAURACIÓN DE STOCK
// ======================================
router.delete("/entregas/detalle/:detalle_id", async (req, res) => {
    const { detalle_id } = req.params;

    try {
        // Iniciar transacción
        await pool.query("BEGIN");

        // 1. Obtener detalles de la entrega original para saber qué material y cantidad restaurar
        const result = await pool.query(
            `SELECT entrega_id, inventario_id, cantidad, cantidad_devuelta 
             FROM detalle_entrega 
             WHERE id = $1`,
            [detalle_id]
        );

        if (result.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({
                mensaje: "El detalle del pedido no existe."
            });
        }

        const { entrega_id, inventario_id, cantidad, cantidad_devuelta } = result.rows[0];

        // 2. Calcular la cantidad que aún no ha sido devuelta y que debe regresar al stock
        const cantidadARestaurar = cantidad - cantidad_devuelta;

        if (cantidadARestaurar > 0) {
            // Reintegrar al stock del inventario
            await pool.query(
                `UPDATE inventario 
                 SET cantidad = cantidad + $1 
                 WHERE id = $2`,
                [cantidadARestaurar, inventario_id]
            );
        }

        // 3. Eliminar el registro del detalle de entrega (por cascada elimina devoluciones)
        await pool.query(
            `DELETE FROM detalle_entrega WHERE id = $1`,
            [detalle_id]
        );

        // 4. Verificar si el acta (entrega principal) aún tiene otros materiales asociados
        const conteo = await pool.query(
            `SELECT COUNT(*) FROM detalle_entrega WHERE entrega_id = $1`,
            [entrega_id]
        );

        const detallesRestantes = parseInt(conteo.rows[0].count, 10);

        // Si ya no quedan detalles para este pedido, eliminar el pedido principal (acta)
        if (detallesRestantes === 0) {
            await pool.query(
                `DELETE FROM entregas WHERE id = $1`,
                [entrega_id]
            );
        }

        // Confirmar transacción
        await pool.query("COMMIT");

        res.json({
            success: true,
            mensaje: "Pedido eliminado correctamente y stock de inventario restaurado."
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error al eliminar pedido:", error);
        res.status(500).json({
            mensaje: "Error al eliminar el pedido.",
            error: error.message
        });
    }
});
// ======================================
// OBTENER MATERIALES EN MAL ESTADO
// ======================================
router.get("/mal-estado", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, devolucion_id, entrega_id, nombre_material, cantidad, fecha_registro
      FROM inventario_mal_estado
      ORDER BY fecha_registro DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener materiales en mal estado" });
  }
});

module.exports = router;