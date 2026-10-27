import { useEffect, useState } from 'react';
import { 
    FaUsers, 
    FaSearch, 
    FaEdit, 
    FaTrash, 
    FaSave, 
    FaTimes, 
    FaCrosshairs, 
    FaMedal,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';

function TablaPersonal() {
    const [personal, setPersonal] = useState([]);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        tipo_arma: '',
        grado: '',
        activo: true
    });

    // ======================================
    // CARGAR PERSONAL
    // ======================================
    const cargarPersonal = async () => {
        try {
            const respuesta = await fetch(
                'http://localhost:3000/api/listar-personal'
            );
            const data = await respuesta.json();
            setPersonal(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        cargarPersonal();
    }, []);

    // ======================================
    // ELIMINAR
    // ======================================
    const eliminarPersonal = async (cedula) => {
        const confirmar = confirm('¿Desea eliminar este registro militar?');
        if (!confirmar) return;

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/eliminar-personal/${cedula}`,
                {
                    method: 'DELETE'
                }
            );
            const data = await respuesta.json();
            alert(data.mensaje);
            cargarPersonal();
        } catch (error) {
            console.log(error);
        }
    };

    // ======================================
    // EDITAR
    // ======================================
    const editarPersonal = (persona) => {
        setEditando(persona.cedula);
        setFormulario({
            nombre: persona.nombre,
            apellido: persona.apellido,
            tipo_arma: persona.tipo_arma,
            grado: persona.grado,
            activo: persona.activo !== false
        });
    };

    // ======================================
    // ACTUALIZAR
    // ======================================
    const actualizarPersonal = async (cedula) => {
        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/actualizar-personal/${cedula}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formulario)
                }
            );
            const data = await respuesta.json();
            alert(data.mensaje);
            setEditando(null);
            cargarPersonal();
        } catch (error) {
            console.log(error);
        }
    };

    // ======================================
    // CAMBIAR ESTADO RÁPIDO (INTERRUPTOR)
    // ======================================
    const cambiarEstadoRapido = async (persona) => {
        const nuevoEstado = !persona.activo;
        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/cambiar-estado-personal/${persona.cedula}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ activo: nuevoEstado })
                }
            );
            if (respuesta.ok) {
                cargarPersonal();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ======================================
    // BUSQUEDA CLIENT-SIDE & ORDENAMIENTO (ACTIVOS PRIMERO)
    // ======================================
    const personalFiltrado = personal
        .filter((persona) => {
            const busquedaLower = busqueda.toLowerCase();
            const estadoStr = persona.activo ? 'activo' : 'inactivo';
            return (
                persona.nombre.toLowerCase().includes(busquedaLower) ||
                persona.apellido.toLowerCase().includes(busquedaLower) ||
                persona.cedula.includes(busquedaLower) ||
                persona.grado.toLowerCase().includes(busquedaLower) ||
                persona.tipo_arma.toLowerCase().includes(busquedaLower) ||
                estadoStr.includes(busquedaLower)
            );
        })
        .sort((a, b) => {
            // Activos (true) primero, Inactivos (false) al final
            if (Boolean(a.activo) === Boolean(b.activo)) {
                return (a.nombre || '').localeCompare(b.nombre || '');
            }
            return a.activo ? -1 : 1;
        });

    const totalActivos = personal.filter((p) => p.activo !== false).length;
    const totalInactivos = personal.filter((p) => p.activo === false).length;

    return (
        <div className="military-container">
            <div className="military-card">
                {/* HEADER */}
                <div className="page-header">
                    <div className="page-logo-container">
                        <FaUsers />
                    </div>
                    <h1 className="page-title">
                        Personal <span>Militar</span>
                    </h1>
                    <p className="page-subtitle">
                        Listado y administración de tropas del Comando Logístico No. 73
                    </p>
                </div>

                {/* CONTROLES (Buscador) */}
                <div className="table-controls" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div className="search-wrapper" style={{ flex: '1', minWidth: '280px' }}>
                        <div className="input-icon-wrapper" style={{ height: '48px' }}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Buscar por Nombre, Cédula, Arma, Grado o Estado..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="military-input"
                                style={{ padding: '12px 12px 12px 54px' }}
                            />
                        </div>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Mostrando: <strong>{personalFiltrado.length}</strong> de {personal.length} militares
                    </div>
                </div>

                {/* TABLA */}
                <div className="table-container">
                    <table className="military-table">
                        <thead>
                            <tr>
                                <th>Grado</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Arma / Especialidad</th>
                                <th>Cédula</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {personalFiltrado.length > 0 ? (
                                personalFiltrado.map((persona) => (
                                    <tr 
                                        key={persona.cedula}
                                        style={{ 
                                            opacity: persona.activo ? 1 : 0.8,
                                            backgroundColor: persona.activo ? 'transparent' : 'rgba(255, 118, 117, 0.04)'
                                        }}
                                    >
                                        {/* GRADO */}
                                        <td>
                                            {editando === persona.cedula ? (
                                                <select
                                                    value={formulario.grado}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            grado: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                >
                                                    <option value="SLDO">SLDO</option>
                                                    <option value="CRNL">CRNL </option> 
                                                    <option value="TCRN">TCRN </option>
                                                    <option value="CAPT">CAPT </option>
                                                    <option value="CBOP">CBOP </option>
                                                    <option value="CBOS">CBOS </option>
                                                    <option value="MAYO">MAYO </option>
                                                    <option value="SGOP">SGOP </option>
                                                    <option value="SGOS">SGOS </option>
                                                    <option value="SLDO">SLDO </option>
                                                    <option value="SUBP">SUBP </option>
                                                    <option value="SUBT">SUBT  </option>
                                                    <option value="TNTE">TNTE </option>
                                                </select>
                                            ) : (
                                                <span className="badge badge-info" style={{ gap: '6px' }}>
                                                    <FaMedal style={{ fontSize: '10px' }} /> {persona.grado}
                                                </span>
                                            )}
                                        </td>

                                        {/* NOMBRE */}
                                        <td>
                                            {editando === persona.cedula ? (
                                                <input
                                                    type="text"
                                                    value={formulario.nombre}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            nombre: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                />
                                            ) : (
                                                persona.nombre
                                            )}
                                        </td>

                                        {/* APELLIDO */}
                                        <td>
                                            {editando === persona.cedula ? (
                                                <input
                                                    type="text"
                                                    value={formulario.apellido}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            apellido: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                />
                                            ) : (
                                                persona.apellido
                                            )}
                                        </td>

                                        {/* ARMA */}
                                        <td>
                                            {editando === persona.cedula ? (
                                                <select
                                                    value={formulario.tipo_arma}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            tipo_arma: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                >
                                                    <option value="TRP">TRP </option>
                                                    <option value="M.G">M.G</option>
                                                    <option value="INT">INT</option>
                                                    <option value="ADMG">ADMG</option>
                                                    <option value="COM">COM</option>
                                                    <option value="E">E</option>
                                                    <option value="I">I</option>
                                                    <option value="M_AE">M_AE</option>
                                                    <option value="M_AUT">M_AUT</option>
                                                    <option value="M_IND">M_IND</option>
                                                    <option value="SND">SND</option>
                                                    <option value="MG">MG</option>
                                                    <option value="M_EQP">M_EQP</option>
                                                    <option value="MMTO">MMTO</option>
                                                </select>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <FaCrosshairs style={{ color: 'var(--text-muted)', fontSize: '12px' }} />
                                                    {persona.tipo_arma}
                                                </span>
                                            )}
                                        </td>

                                        {/* CEDULA */}
                                        <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                                            {persona.cedula}
                                        </td>

                                        {/* ESTADO CON INTERRUPTOR */}
                                        <td style={{ textAlign: 'center' }}>
                                            {editando === persona.cedula ? (
                                                <label className="military-switch" title="Cambiar estado en modo edición">
                                                    <input
                                                        type="checkbox"
                                                        checked={formulario.activo}
                                                        onChange={(e) =>
                                                            setFormulario({
                                                                ...formulario,
                                                                activo: e.target.checked
                                                            })
                                                        }
                                                    />
                                                    <span className="military-switch-slider"></span>
                                                    <span className={`military-switch-label ${formulario.activo ? 'active' : 'inactive'}`}>
                                                        {formulario.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </label>
                                            ) : (
                                                <label 
                                                    className="military-switch" 
                                                    title={`Cambiar a ${persona.activo ? 'Inactivo' : 'Activo'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(persona.activo)}
                                                        onChange={() => cambiarEstadoRapido(persona)}
                                                    />
                                                    <span className="military-switch-slider"></span>
                                                    <span className={`military-switch-label ${persona.activo ? 'active' : 'inactive'}`}>
                                                        {persona.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </label>
                                            )}
                                        </td>

                                        {/* BOTONES ACCIONES */}
                                        <td>
                                            <div className="action-buttons">
                                                {editando === persona.cedula ? (
                                                    <>
                                                        <button
                                                            className="action-btn action-btn-save"
                                                            title="Guardar cambios"
                                                            onClick={() => actualizarPersonal(persona.cedula)}
                                                        >
                                                            <FaSave />
                                                        </button>
                                                        <button
                                                            className="action-btn action-btn-delete"
                                                            title="Cancelar"
                                                            onClick={() => setEditando(null)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="action-btn action-btn-edit"
                                                            title="Editar registro"
                                                            onClick={() => editarPersonal(persona)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="action-btn action-btn-delete"
                                                            title="Eliminar registro"
                                                            onClick={() => eliminarPersonal(persona.cedula)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                        No se encontraron registros de personal militar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* RESUMEN DE TOTALES AL FINAL DE LA TABLA */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    marginTop: '20px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUsers style={{ color: 'var(--accent-gold)', fontSize: '16px' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                            Resumen de Personal Militar
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-success" style={{ gap: '6px', padding: '6px 14px', fontSize: '13px' }}>
                            <FaCheckCircle style={{ fontSize: '12px' }} /> Activos: <strong>{totalActivos}</strong>
                        </span>
                        <span className="badge badge-danger" style={{ gap: '6px', padding: '6px 14px', fontSize: '13px' }}>
                            <FaTimesCircle style={{ fontSize: '12px' }} /> Inactivos: <strong>{totalInactivos}</strong>
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: 'var(--accent-gold)',
                            fontWeight: 'bold',
                            background: 'rgba(212, 175, 55, 0.12)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}>
                            Total: <strong>{personal.length}</strong> militares
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TablaPersonal;