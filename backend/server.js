const express = require('express');

const cors = require('cors');

const app = express();

const checkAndHashPasswords = require('./config/hash-helper');


// ======================================

app.use(cors());

app.use(express.json());


// ======================================
// IMPORTAR RUTAS
// ======================================

const personalRoutes = require('./rutas/personal.routes');

const authRoutes = require('./rutas/auth.routes');

const bodegaRoutes = require('./rutas/bodega.routes');
const malEstadoRoutes = require('./rutas/mal_estado.routes');

console.log("ANTES DE CARGAR ENTREGA");

const entregaRoutes = require('./rutas/entrega.routes');
const pedidosRoutes = require('./rutas/pedidos.routes');
const movimientosRoutes = require('./rutas/movimientos.routes');

console.log("DESPUES DE CARGAR ENTREGA");
// ======================================
// USAR RUTAS
// ======================================

app.use('/api', personalRoutes);

app.use('/api', authRoutes);

app.use('/api', bodegaRoutes);

app.use('/api', entregaRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', malEstadoRoutes);
// ======================================

app.listen(3000, async ()=>{

    console.log(

        'Servidor ejecutándose en puerto 3000'

    );

    // Encriptar contraseñas existentes
    await checkAndHashPasswords();

});