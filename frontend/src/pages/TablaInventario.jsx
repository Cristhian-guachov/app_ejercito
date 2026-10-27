import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoGiron from '../assets/logo_giron.png';
import API_URL from '../config/api';
import {
    FaEdit,
    FaTrash,
    FaSave,
    FaBoxes,
    FaSearch,
    FaTimes,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaSlidersH,
    FaFilePdf
} from 'react-icons/fa';

function TablaInventario() {
    const [inventario, setInventario] = useState([]);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [formulario, setFormulario] = useState({
        nombre_material: '',
        tipo_material: '',
        cantidad: ''
    });

    // ======================================
    // ESTADOS Y MÉTODOS DE AJUSTE DE STOCK
    // ======================================
    const [modalAjusteAbierto, setModalAjusteAbierto] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [nuevaCantidad, setNuevaCantidad] = useState('');
    const [motivoAjuste, setMotivoAjuste] = useState('');

    const abrirAjusteModal = (item) => {
        setItemSeleccionado(item);
        setNuevaCantidad(item.cantidad);
        setMotivoAjuste('');
        setModalAjusteAbierto(true);
    };

    const guardarAjusteStock = async (e) => {
        e.preventDefault();
        if (!itemSeleccionado) return;

        if (Number(nuevaCantidad) === Number(itemSeleccionado.cantidad)) {
            alert('La nueva cantidad debe ser diferente a la cantidad actual');
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/ajustar-inventario/${itemSeleccionado.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cantidad_nueva: Number(nuevaCantidad),
                        motivo: motivoAjuste
                    })
                }
            );

            const data = await respuesta.json();
            alert(data.mensaje);

            if (respuesta.ok && data.success) {
                setModalAjusteAbierto(false);
                setItemSeleccionado(null);
                cargarInventario();
            }
        } catch (error) {
            console.log(error);
            alert('Error al guardar el ajuste de stock');
        }
    };

    // ======================================
    // CARGAR INVENTARIO
    // ======================================
    const cargarInventario = async () => {
        try {
            const respuesta = await fetch(
                `${API_URL}/api/listar-bodega`
            );
            const data = await respuesta.json();
            setInventario(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        cargarInventario();
    }, []);

    // ======================================
    // ELIMINAR
    // ======================================
    const eliminarInventario = async (id) => {
        const confirmar = confirm('¿Desea eliminar este material del inventario?');
        if (!confirmar) return;

        try {
            const respuesta = await fetch(
                `${API_URL}/api/eliminar-bodega/${id}`,
                {
                    method: 'DELETE'
                }
            );
            const data = await respuesta.json();
            alert(data.mensaje);
            cargarInventario();
        } catch (error) {
            console.log(error);
        }
    };

    // ======================================
    // EDITAR
    // ======================================
    const editarInventario = (item) => {
        setEditando(item.id);
        setFormulario({
            nombre_material: item.nombre_material,
            tipo_material: item.tipo_material,
            cantidad: item.cantidad
        });
    };

    // ======================================
    // ACTUALIZAR
    // ======================================
    const actualizarInventario = async (id) => {
        try {
            const respuesta = await fetch(
                `${API_URL}/api/actualizar-bodega/${id}`,
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
            cargarInventario();
        } catch (error) {
            console.log(error);
        }
    };

    // ======================================
    // BUSQUEDA CLIENT-SIDE
    // ======================================
    const inventarioFiltrado = inventario.filter((item) => {
        const busquedaLower = (busqueda ?? '').toLowerCase();
        const nombre = (item?.nombre_material ?? '').toString();
        const tipo = (item?.tipo_material ?? '').toString();
        return nombre.toLowerCase().includes(busquedaLower) || tipo.toLowerCase().includes(busquedaLower);
    });

    // ======================================
    // DETECTAR NIVEL DE STOCK
    // ======================================
    const renderStockBadge = (cantidad) => {
        const cant = Number(cantidad);
        if (cant === 0) {
            return (
                <span className="badge badge-danger" style={{ gap: '6px' }}>
                    <FaTimesCircle /> Agotado
                </span>
            );
        } else if (cant < 5) {
            return (
                <span className="badge badge-warning" style={{ gap: '6px' }}>
                    <FaExclamationTriangle /> Crítico ({cant})
                </span>
            );
        } else {
            return (
                <span className="badge badge-success" style={{ gap: '6px' }}>
                    <FaCheckCircle /> Disponible ({cant})
                </span>
            );
        }
    };

    // Badge para la categoría de material
    const renderCategoriaBadge = (tipo) => {
        switch (tipo) {
            case 'Armamento':
                return <span className="badge badge-danger">{tipo}</span>;
            case 'Munición':
                return <span className="badge badge-warning">{tipo}</span>;
            case 'Vehículos':
                return <span className="badge badge-info">{tipo}</span>;
            default:
                return <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>{tipo}</span>;
        }
    };

    // ======================================
    // GENERAR PDF DE INVENTARIO
    // ======================================
    const generarPDFInventario = () => {
        const listaAExportar = inventarioFiltrado.length > 0 ? inventarioFiltrado : inventario;

        if (!listaAExportar || listaAExportar.length === 0) {
            alert('No hay materiales en inventario para exportar.');
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        /* ===========================
           COLORES INSTITUCIONALES
        =========================== */
        const verde = [33, 52, 28];
        const dorado = [212, 175, 55];
        const grisClaro = [245, 245, 245];

        /* ===========================
           ENCABEZADO
        =========================== */
        doc.setFillColor(...verde);
        doc.rect(0, 0, 210, 35, "F");

        // Escudo
        try {
            doc.addImage(
                logoGiron,
                "PNG",
                10,
                4,
                22,
                22
            );
        } catch (error) {
            console.error("No se pudo cargar el logo institucional:", error);
        }

        // Títulos institucionales
        doc.setTextColor(...dorado);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(
            "BATALLÓN DE LOGÍSTICA N.º 73 'GIRÓN'",
            105,
            12,
            { align: "center" }
        );

        doc.setFontSize(13);
        doc.text(
            "PODER DE COMBATE",
            105,
            20,
            { align: "center" }
        );

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(
            "INVENTARIO GENERAL DE BODEGA",
            105,
            28,
            { align: "center" }
        );

        /* ===========================
           DATOS GENERALES
        =========================== */
        doc.setFillColor(...grisClaro);
        doc.roundedRect(10, 42, 190, 18, 3, 3, "F");

        const ahora = new Date();
        const fechaFormateada = ahora.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("REPORTE DE INVENTARIO DE BODEGA", 15, 49);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const totalItems = listaAExportar.length;
        const totalStock = listaAExportar.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
        doc.text(
            `Fecha de emisión: ${fechaFormateada}    |    Total de materiales: ${totalItems}    |    Stock total: ${totalStock} unidades`,
            15,
            56
        );

        /* ===========================
           TABLA DE MATERIALES
        =========================== */
        const obtenerEstadoStock = (cantNum) => {
            const cant = Number(cantNum) || 0;
            if (cant === 0) return "Agotado (0)";
            if (cant < 5) return `Crítico (${cant})`;
            return `Disponible (${cant})`;
        };

        const tableRows = listaAExportar.map((item, idx) => [
            idx + 1,
            item.nombre_material || "N/A",
            item.tipo_material || "N/A",
            obtenerEstadoStock(item.cantidad)
        ]);

        autoTable(doc, {
            startY: 66,
            head: [["N°", "Nombre Material", "Tipo de Material", "Estado / Stock"]],
            body: tableRows,
            theme: "grid",
            headStyles: {
                fillColor: verde,
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center"
            },
            bodyStyles: {
                fontSize: 10
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: {
                    halign: "center",
                    cellWidth: 15
                },
                1: {
                    halign: "left"
                },
                2: {
                    halign: "center",
                    cellWidth: 55
                },
                3: {
                    halign: "center",
                    cellWidth: 45
                }
            }
        });

        /* ===========================
           RESUMEN
        =========================== */
        let finalY = doc.lastAutoTable.finalY + 8;
        if (finalY > 265) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFillColor(...grisClaro);
        doc.roundedRect(10, finalY, 190, 16, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`Total de materiales listados: ${totalItems}`, 15, finalY + 7);

        doc.setFont("helvetica", "normal");
        doc.text(`Total de unidades disponibles en stock: ${totalStock}`, 15, finalY + 13);

        /* ===========================
           PIE DE PÁGINA
        =========================== */
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text(
                `Página ${i} de ${pageCount} - Batallón de Logística N.º 73 "Girón"`,
                105,
                290,
                { align: "center" }
            );
        }

        const fechaIso = ahora.toISOString().slice(0, 10);
        doc.save(`Inventario_Bodega_${fechaIso}.pdf`);
    };

    return (
        <div className="military-container">
            <div className="military-card">
                {/* HEADER */}
                <div className="page-header">
                    <div className="page-logo-container">
                        <FaBoxes />
                    </div>
                    <h1 className="page-title">
                        Inventario <span>Bodega</span>
                    </h1>
                    <p className="page-subtitle">
                        Control general de existencias, armamento, munición y equipos militares
                    </p>
                </div>

                {/* CONTROLES */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <div className="input-icon-wrapper" style={{ height: '48px' }}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Buscar por Nombre o Tipo de Material..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="military-input"
                                style={{ padding: '12px 12px 12px 54px' }}
                            />
                        </div>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Items en Bodega: <strong>{inventarioFiltrado.length}</strong>
                    </div>
                </div>

                {/* TABLA */}
                <div className="table-container">
                    <table className="military-table">
                        <thead>
                            <tr>
                                <th>Nombre Material</th>
                                <th>Tipo de Material</th>
                                <th>Estado / Stock</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {inventarioFiltrado.length > 0 ? (
                                inventarioFiltrado.map((item) => (
                                    <tr key={item.id}>
                                        {/* NOMBRE MATERIAL */}
                                        <td>
                                            {editando === item.id ? (
                                                <input
                                                    type="text"
                                                    value={formulario.nombre_material}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            nombre_material: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                />
                                            ) : (
                                                <strong style={{ color: 'var(--text-primary)' }}>
                                                    {item.nombre_material}
                                                </strong>
                                            )}
                                        </td>

                                        {/* TIPO MATERIAL */}
                                        <td>
                                            {editando === item.id ? (
                                                <select
                                                    value={formulario.tipo_material}
                                                    onChange={(e) =>
                                                        setFormulario({
                                                            ...formulario,
                                                            tipo_material: e.target.value
                                                        })
                                                    }
                                                    className="table-input"
                                                >
                                                    <option value="Material Orgánico">Material Orgánico</option>
                                                    <option value="Material de Depósito">Material de Depósito</option>
                                                    <option value="Armamento">Armamento</option>
                                                    <option value="Munición">Munición</option>
                                                    <option value="Comunicación">Comunicación</option>
                                                    <option value="Vehículos">Vehículos</option>
                                                </select>
                                            ) : (
                                                renderCategoriaBadge(item.tipo_material)
                                            )}
                                        </td>

                                        {/* CANTIDAD */}
                                        <td>
                                            {editando === item.id ? (
                                                <input
                                                    type="number"
                                                    value={formulario.cantidad}
                                                    className="table-input"
                                                    disabled
                                                    title="El stock solo puede ser modificado a través del botón de Ajustar Stock"
                                                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                                />
                                            ) : (
                                                renderStockBadge(item.cantidad)
                                            )}
                                        </td>

                                        {/* ACCIONES */}
                                        <td>
                                            <div className="action-buttons">
                                                {editando === item.id ? (
                                                    <>
                                                        <button
                                                            className="action-btn action-btn-save"
                                                            title="Guardar"
                                                            onClick={() => actualizarInventario(item.id)}
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
                                                            title="Editar"
                                                            onClick={() => editarInventario(item)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="action-btn action-btn-edit"
                                                            style={{ backgroundColor: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: 'var(--text-primary)' }}
                                                            title="Ajustar Stock"
                                                            onClick={() => abrirAjusteModal(item)}
                                                        >
                                                            <FaSlidersH />
                                                        </button>
                                                        <button
                                                            className="action-btn action-btn-delete"
                                                            title="Eliminar"
                                                            onClick={() => eliminarInventario(item.id)}
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
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                        No se encontraron materiales en inventario.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ACCIONES AL FINAL DE LA TABLA */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Mostrando <strong>{inventarioFiltrado.length}</strong> de <strong>{inventario.length}</strong> materiales registrados
                    </div>
                    <button
                        type="button"
                        className="btn btn-gold"
                        onClick={generarPDFInventario}
                        title="Descargar reporte de inventario en PDF"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FaFilePdf /> Descargar Inventario (PDF)
                    </button>
                </div>
            </div>

            {/* MODAL DE AJUSTE DE STOCK */}
            {modalAjusteAbierto && itemSeleccionado && (
                <div style={modalStyles.overlay}>
                    <div className="military-card" style={modalStyles.modal}>
                        <div className="page-header" style={{ marginBottom: '20px' }}>
                            <h2 className="page-title" style={{ fontSize: '24px' }}>
                                Ajustar <span>Stock</span>
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 0' }}>
                                {itemSeleccionado.nombre_material} ({itemSeleccionado.tipo_material})
                            </p>
                        </div>

                        <form onSubmit={guardarAjusteStock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="military-label">Cantidad Actual</label>
                                <input
                                    type="text"
                                    value={itemSeleccionado.cantidad}
                                    className="military-input"
                                    disabled
                                    style={{ opacity: 0.6 }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="military-label">Nueva Cantidad</label>
                                <input
                                    type="number"
                                    value={nuevaCantidad}
                                    onChange={(e) => setNuevaCantidad(e.target.value)}
                                    className="military-input"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="military-label">Causa del Cambio / Observación</label>
                                <textarea
                                    value={motivoAjuste}
                                    onChange={(e) => setMotivoAjuste(e.target.value)}
                                    className="military-input"
                                    placeholder="Escriba la causa detallada del ajuste del stock (ej: Ingreso por compra, material dañado, conteo físico, etc.)"
                                    required
                                    rows="3"
                                    style={{ padding: '12px', height: 'auto', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>
                                    Guardar Ajuste
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    onClick={() => setModalAjusteAbierto(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out'
    },
    modal: {
        width: '100%',
        maxWidth: '480px',
        padding: '30px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--accent-gold)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease-out'
    }
};

export default TablaInventario;