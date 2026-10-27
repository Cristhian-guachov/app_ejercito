const bcrypt = require('bcryptjs');
const pool = require('./db');

async function checkAndHashPasswords() {
    try {
        const resultado = await pool.query('SELECT id, usuario, password FROM usuarios');
        for (const user of resultado.rows) {
            // Verificar si la contraseña ya tiene el formato hash de bcrypt
            const isHashed = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
            if (!isHashed) {
                console.log(`[Hash Helper] Encriptando contraseña en texto plano para el usuario: ${user.usuario}`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
                console.log(`[Hash Helper] Contraseña encriptada exitosamente para: ${user.usuario}`);
            }
        }
    } catch (error) {
        console.error('[Hash Helper] Error al encriptar contraseñas:', error.message);
    }
}

module.exports = checkAndHashPasswords;
