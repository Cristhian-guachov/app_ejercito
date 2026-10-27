import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUser, FaLock } from 'react-icons/fa';
import API_URL from '../config/api';

function Login() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    const iniciarSesion = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, password })
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.success) {
                localStorage.setItem('login', 'true');
                localStorage.setItem('rol', data.rol || 'admin');
                
                if (data.rol === 'personal') {
                    localStorage.setItem('cedula', data.cedula);
                    localStorage.setItem('nombre', `${data.grado || ''} ${data.nombre} ${data.apellido}`.trim());
                    localStorage.setItem('grado', data.grado || '');
                    navigate('/historial-entregas');
                } else {
                    localStorage.removeItem('cedula');
                    localStorage.removeItem('nombre');
                    localStorage.removeItem('grado');
                    navigate('/personal');
                }
            } else {
                alert(data.mensaje || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error de conexión con el servidor');
        }
    };

    return (
        <div style={styles.viewContainer}>
            <div className="military-card" style={styles.loginCard}>
                {/* LOGO DE ENCABEZADO */}
                <div className="page-header" style={{ marginBottom: '24px' }}>
                    <div className="page-logo-container" style={{ width: '90px', height: '90px', fontSize: '38px' }}>
                        <FaUserShield />
                    </div>
                    <h1 className="page-title" style={{ fontSize: '30px', margin: '10px 0 4px' }}>
                        SISTEMA <span>MILITAR</span>
                    </h1>
                    <p style={styles.subtext}>
                        Comando Logístico No. 73 "Girón"
                    </p>
                </div>

                <div style={styles.divider}>
                    <span style={styles.dividerLine}></span>
                    <span style={styles.dividerText}>INICIO DE SESIÓN</span>
                    <span style={styles.dividerLine}></span>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={iniciarSesion} style={styles.form}>
                    {/* USUARIO */}
                    <div className="form-group">
                        <label className="military-label">Usuario / Cédula</label>
                        <div className="input-icon-wrapper">
                            <FaUser />
                            <input
                                type="text"
                                placeholder="Usuario o Cédula Militar"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label className="military-label">Contraseña</label>
                        <div className="input-icon-wrapper">
                            <FaLock />
                            <input
                                type="password"
                                placeholder="Contraseña (Cédula para personal)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* BOTÓN INGRESAR */}
                    <button type="submit" className="btn btn-gold" style={{ marginTop: '10px', width: '100%' }}>
                        Ingresar al Sistema
                    </button>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0' }}>
                        * <strong>Personal Militar:</strong> Ingrese su número de cédula en usuario y contraseña para consultar sus pedidos.
                    </p>
                </form>
            </div>
        </div>
    );
}

// Estilos específicos para maquetación del login
const styles = {
    viewContainer: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
    },
    loginCard: {
        width: '100%',
        maxWidth: '440px',
        animation: 'fadeIn 0.5s ease-out',
    },
    subtext: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: '500',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0 24px',
        gap: '12px',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(212, 175, 55, 0.15)',
    },
    dividerText: {
        fontSize: '11px',
        fontWeight: '700',
        color: 'var(--accent-gold)',
        letterSpacing: '0.15em',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    }
};

export default Login;