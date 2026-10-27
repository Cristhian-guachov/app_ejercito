import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
    FaUserShield, 
    FaUsers, 
    FaUserPlus, 
    FaWarehouse, 
    FaPlusCircle, 
    FaList, 
    FaHistory, 
    FaExchangeAlt, 
    FaSignOutAlt, 
    FaBars, 
    FaTimes, 
    FaExclamationTriangle 
} from "react-icons/fa";

function Menu() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const rol = localStorage.getItem("rol");
    const nombreUsuario = localStorage.getItem("nombre");
    const cedulaUsuario = localStorage.getItem("cedula");
    const esPersonal = rol === "personal";

    // Función auxiliar para determinar si una ruta está activa
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("rol");
        localStorage.removeItem("cedula");
        localStorage.removeItem("nombre");
        localStorage.removeItem("grado");
        closeSidebar();
    };

    return (
        <div className="app-layout">
            {/* OVERLAY PARA MÓVIL */}
            <div 
                className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} 
                onClick={closeSidebar}
            />

            {/* TOPBAR MÓVIL */}
            <div className="mobile-topbar">
                <span className="mobile-topbar-title">SISTEMA MILITAR</span>
                <button className="menu-toggle-btn" onClick={toggleSidebar}>
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* MENÚ LATERAL (SIDEBAR) */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">
                        SISTEMA <span>MILITAR</span>
                    </h1>
                    <span className="sidebar-subtitle">
                        Comando Logístico No. 73 "Girón"
                    </span>
                </div>

                {/* TARJETA IDENTIFICACIÓN SI ES PERSONAL MILITAR */}
                {esPersonal && (
                    <div style={{
                        padding: '12px 14px',
                        margin: '0 16px 16px',
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <div style={{ fontSize: '10px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'bold' }}>
                            Personal Militar
                        </div>
                        <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={nombreUsuario}>
                            {nombreUsuario || 'Militar'}
                        </div>
                        {cedulaUsuario && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '1px' }}>
                                C.I: {cedulaUsuario}
                            </div>
                        )}
                    </div>
                )}

                <ul className="sidebar-menu">
                    {esPersonal ? (
                        /* MENÚ EXCLUSIVO PARA PERSONAL MILITAR */
                        <>
                            <li className="menu-section-title">Mis Consultas</li>
                            <li>
                                <Link
                                    to="/historial-entregas"
                                    className={`menu-link ${isActive("/historial-entregas")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaHistory />
                                    <span>Mis Pedidos y Actas</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        /* MENÚ COMPLETO ADMINISTRATIVO */
                        <>
                            {/* SECCIÓN PERSONAL */}
                            <li className="menu-section-title">Personal Militar</li>
                            <li>
                                <Link
                                    to="/personal"
                                    className={`menu-link ${isActive("/personal")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaUserPlus />
                                    <span>Formulario Personal</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/tabla-personal"
                                    className={`menu-link ${isActive("/tabla-personal")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaUsers />
                                    <span>Tabla Personal</span>
                                </Link>
                            </li>

                            {/* SECCIÓN INVENTARIO */}
                            <li className="menu-section-title">Inventario</li>
                            <li>
                                <Link
                                    to="/inventario"
                                    className={`menu-link ${isActive("/inventario")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaPlusCircle />
                                    <span>Formulario Inventario</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/tabla-inventario"
                                    className={`menu-link ${isActive("/tabla-inventario")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaWarehouse />
                                    <span>Tabla Inventario</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/historial-inventario"
                                    className={`menu-link ${isActive("/historial-inventario")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaHistory />
                                    <span>Historial Inventario</span>
                                </Link>
                            </li>

                            {/* SECCIÓN PEDIDOS Y CONTROL */}
                            <li className="menu-section-title">Pedidos y Control</li>
                            <li>
                                <Link
                                    to="/entrega-material"
                                    className={`menu-link ${isActive("/entrega-material")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaExchangeAlt />
                                    <span>Pedido de Material</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/historial-entregas"
                                    className={`menu-link ${isActive("/historial-entregas")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaHistory />
                                    <span>Historial de Pedidos</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/mal-estado"
                                    className={`menu-link ${isActive("/mal-estado")}`}
                                    onClick={closeSidebar}
                                >
                                    <FaExclamationTriangle />
                                    <span>Materiales en mal estado</span>
                                </Link>
                            </li>
                        </>
                    )}

                    {/* SECCIÓN SISTEMA */}
                    <li className="menu-section-title">Sistema</li>
                    <li>
                        <Link
                            to="/login"
                            className="menu-link logout-link"
                            onClick={cerrarSesion}
                        >
                            <FaSignOutAlt />
                            <span>Cerrar Sesión</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="app-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Menu;