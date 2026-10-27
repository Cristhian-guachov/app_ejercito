import { useEffect, useState } from "react";
import { 
    FaHistory, 
    FaSearch, 
    FaCalendarAlt, 
    FaClock,
    FaBoxes, 
    FaRegCommentAlt,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";
import API_URL from "../config/api";

function HistorialInventario() {
    const [historial, setHistorial] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        try {
            const res = await fetch(
                `${API_URL}/api/historial-inventario`
            );
            const data = await res.json();
            setHistorial(data);
        } catch (error) {
            console.error("Error al obtener el historial de inventario:", error);
        }
    };

    // ======================================
    // BUSQUEDA CLIENT-SIDE
    // ======================================
    const historialFiltrado = historial.filter((item) => {
        const busquedaLower = busqueda.toLowerCase();
        return (
            item.nombre_material.toLowerCase().includes(busquedaLower) ||
            item.motivo.toLowerCase().includes(busquedaLower)
        );
    });

    // Formatear fecha y hora
    const formatFechaHora = (fechaStr) => {
        const fecha = new Date(fechaStr);
        const fechaFormato = fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        const horaFormato = fecha.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        return { fecha: fechaFormato, hora: horaFormato };
    };

    return (
        <div className="military-container">
            <div className="military-card">
                {/* HEADER */}
                <div className="page-header">
                    <div className="page-logo-container">
                        <FaHistory />
                    </div>
                    <h1 className="page-title">
                        Historial <span>Inventario</span>
                    </h1>
                    <p className="page-subtitle">
                        Registro y auditoría de ajustes de stock, mermas y reabastecimientos de bodega
                    </p>
                </div>

                {/* CONTROLES */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <div className="input-icon-wrapper" style={{ height: '48px' }}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Buscar por Material o Causa del Ajuste..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="military-input"
                                style={{ padding: '12px 12px 12px 54px' }}
                            />
                        </div>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Ajustes registrados: <strong>{historialFiltrado.length}</strong>
                    </div>
                </div>

                {/* TABLA */}
                <div className="table-container">
                    <table className="military-table">
                        <thead>
                            <tr>
                                <th>Fecha y Hora</th>
                                <th>Material</th>
                                <th style={{ textAlign: 'center' }}>Stock Anterior</th>
                                <th style={{ textAlign: 'center' }}>Stock Nuevo</th>
                                <th style={{ textAlign: 'center' }}>Ajuste</th>
                                <th>Causa del Cambio</th>
                            </tr>
                        </thead>

                        <tbody>
                            {historialFiltrado.length > 0 ? (
                                historialFiltrado.map((item) => {
                                    const { fecha, hora } = formatFechaHora(item.fecha_cambio);
                                    const esIncremento = item.diferencia > 0;
                                    
                                    return (
                                        <tr key={item.id}>
                                            {/* FECHA Y HORA */}
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                        <FaCalendarAlt style={{ color: 'var(--accent-gold)' }} />
                                                        {fecha}
                                                    </span>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                        <FaClock style={{ color: 'var(--text-muted)' }} />
                                                        {hora}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* MATERIAL */}
                                            <td>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                    <FaBoxes style={{ color: 'var(--text-muted)' }} />
                                                    {item.nombre_material}
                                                </span>
                                            </td>

                                            {/* STOCK ANTERIOR */}
                                            <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                                {item.cantidad_anterior}
                                            </td>

                                            {/* STOCK NUEVO */}
                                            <td style={{ textAlign: 'center', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                {item.cantidad_nueva}
                                            </td>

                                            {/* DIFERENCIA / AJUSTE */}
                                            <td style={{ textAlign: 'center' }}>
                                                {esIncremento ? (
                                                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700', minWidth: '55px', justifyContent: 'center' }}>
                                                        <FaArrowUp fontSize="10px" /> +{item.diferencia}
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700', minWidth: '55px', justifyContent: 'center' }}>
                                                        <FaArrowDown fontSize="10px" /> {item.diferencia}
                                                    </span>
                                                )}
                                            </td>

                                            {/* CAUSA / MOTIVO */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                                    <FaRegCommentAlt style={{ marginTop: '3px', flexShrink: 0, color: 'var(--accent-gold)' }} />
                                                    <span style={{ fontWeight: '500' }}>{item.motivo}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                        No se encontraron registros de ajustes en el historial.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default HistorialInventario;
