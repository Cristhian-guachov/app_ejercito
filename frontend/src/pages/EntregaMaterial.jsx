import { useEffect, useState } from "react";
import { 
    FaExchangeAlt, 
    FaUserShield, 
    FaBoxes, 
    FaPlus, 
    FaTrash, 
    FaRegCommentAlt,
    FaCheckCircle,
    FaDownload,
    FaTimes
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoGiron from "../assets/logo_giron.png";


function EntregaMaterial() {
    const [personal, setPersonal] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [cedula, setCedula] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [materiales, setMateriales] = useState([
        {
            inventario_id: "",
            cantidad: ""
        }
    ]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState({
        entregaId: "",
        fechaEntrega: "",
        militar: null,
        items: [],
        obs: ""
    });


    useEffect(() => {
        cargarPersonal();
        cargarInventario();
    }, []);

    const cargarPersonal = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/personal");
            const data = await res.json();
            setPersonal(data);
        } catch (error) {
            console.log(error);
        }
    };

    const cargarInventario = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/inventario");
            const data = await res.json();
            setInventario(data);
        } catch (error) {
            console.log(error);
        }
    };

    const agregarMaterial = () => {
        setMateriales([
            ...materiales,
            {
                inventario_id: "",
                cantidad: ""
            }
        ]);
    };

    const eliminarMaterial = (index) => {
        if (materiales.length === 1) {
            alert("Debe ingresar al menos un material para la entrega.");
            return;
        }
        const copia = materiales.filter((_, i) => i !== index);
        setMateriales(copia);
    };

    const cambiarMaterial = (index, campo, valor) => {
        const copia = [...materiales];
        copia[index][campo] = valor;
        setMateriales(copia);
    };

const generarPDFPedido = (datos) => {
    const { entregaId, fechaEntrega, militar, items, obs } = datos;

    if (!militar) return;

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
    doc.addImage(
        logoGiron,
        "PNG",
        10,
        4,
        22,
        22
    );

    // Títulos
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
        "ACTA DE ENTREGA DE MATERIAL",
        105,
        28,
        { align: "center" }
    );

    /* ===========================
       DATOS GENERALES
    =========================== */

    doc.setFillColor(...grisClaro);
    doc.roundedRect(10, 42, 190, 22, 3, 3, "F");

    const fechaFormateada = new Date(fechaEntrega).toLocaleString(
        "es-ES",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

    doc.setTextColor(0);
    doc.setFontSize(11);

    doc.setFont("helvetica", "bold");
    doc.text(
        `ACTA N° ${String(entregaId).padStart(5, "0")}`,
        15,
        50
    );

    doc.setFont("helvetica", "normal");
    doc.text(
        `Fecha de entrega: ${fechaFormateada}`,
        15,
        58
    );

    /* ===========================
       DATOS DEL SOLICITANTE
    =========================== */

    doc.setFillColor(...verde);
    doc.rect(10, 72, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL SOLICITANTE", 15, 77);

    doc.setTextColor(0);

    doc.roundedRect(10, 80, 190, 28, 2, 2);

    doc.setFont("helvetica", "normal");

    doc.text(
        `Grado: ${militar.grado}`,
        15,
        90
    );

    doc.text(
        `Nombre: ${militar.nombre} ${militar.apellido}`,
        15,
        98
    );

    doc.text(
        `Cédula: ${militar.cedula}`,
        120,
        90
    );

    /* ===========================
       TABLA DE MATERIALES
    =========================== */

    const tableRows = items.map((item, idx) => [
        idx + 1,
        item.nombre_material,
        item.cantidad
    ]);

    autoTable(doc, {
        startY: 118,
        head: [["N°", "MATERIAL", "CANTIDAD"]],
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
            2: {
                halign: "center",
                cellWidth: 30
            }
        }
    });

    /* ===========================
       OBSERVACIONES
    =========================== */

    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFillColor(...verde);
    doc.rect(10, finalY, 190, 8, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES", 15, finalY + 5.5);

    finalY += 10;

    doc.setTextColor(0);

    doc.roundedRect(
        10,
        finalY,
        190,
        25,
        2,
        2
    );

    doc.setFont("helvetica", "normal");

    doc.text(
        doc.splitTextToSize(
            obs || "Sin observaciones.",
            180
        ),
        15,
        finalY + 8
    );

    /* ===========================
       FIRMAS
    =========================== */

    finalY += 45;

    doc.line(25, finalY, 85, finalY);
    doc.line(125, finalY, 185, finalY);

    doc.setFont("helvetica", "bold");

    doc.text(
        "ENTREGADO POR",
        55,
        finalY + 6,
        { align: "center" }
    );

    doc.text(
        "RECIBIDO CONFORME",
        155,
        finalY + 6,
        { align: "center" }
    );

    /* ===========================
       PIE DE PÁGINA
    =========================== */

    doc.setDrawColor(...dorado);
    doc.line(10, 285, 200, 285);

    doc.setFontSize(8);
    doc.setTextColor(80);

    doc.text(
        "Batallón de Logística Nº73 'Girón' - Sistema de Gestión de Materiales",
        105,
        290,
        { align: "center" }
    );

    doc.save(
        `Acta_Entrega_${entregaId}.pdf`
    );
};
    const guardarEntrega = async (e) => {
        e.preventDefault();

        // Validaciones previas
        if (materiales.some(m => !m.inventario_id || !m.cantidad)) {
            alert("Por favor complete todos los campos de materiales.");
            return;
        }
        // Validar stock disponible antes de enviar la solicitud
        for (const m of materiales) {
            const invItem = inventario.find(i => i.id === Number(m.inventario_id));
            if (invItem && Number(m.cantidad) > Number(invItem.cantidad)) {
                alert(`Stock insuficiente para ${invItem.nombre_material}. Disponible: ${invItem.cantidad}`);
                return;
            }
        }

        const militarObj = personal.find(p => p.cedula === cedula);
        const itemsList = materiales.map(m => {
            const invItem = inventario.find(i => i.id === Number(m.inventario_id));
            return {
                nombre_material: invItem ? invItem.nombre_material : "Material",
                cantidad: m.cantidad
            };
        });

        try {
            const res = await fetch(
                "http://localhost:3000/api/entregas",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cedula,
                        observaciones,
                        materiales
                    })
                }
            );

            const data = await res.json();

            if (res.ok) {
                setSuccessData({
                    entregaId: data.entregaId,
                    fechaEntrega: data.fecha_entrega,
                    militar: militarObj,
                    items: itemsList,
                    obs: observaciones
                });
                setShowSuccessModal(true);

                setCedula("");
                setObservaciones("");
                setMateriales([
                    {
                        inventario_id: "",
                        cantidad: ""
                    }
                ]);
                cargarInventario(); // Recargar inventario para actualizar stocks en la vista
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="military-container">
            <div className="military-card">
                {/* HEADER */}
                <div className="page-header">
                    <div className="page-logo-container">
                        <FaExchangeAlt />
                    </div>
                    <h1 className="page-title">
                        Pedido de <span>Material</span>
                    </h1>
                    <p className="page-subtitle">
                        Asignación, dotación y control de equipos al personal militar
                    </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={guardarEntrega} className="military-form">
                    {/* SELECCIÓN MILITAR */}
                    <div className="form-group form-group-full">
                        <label className="military-label">Personal Militar</label>
                        <div className="input-icon-wrapper">
                            <FaUserShield />
                            <select
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                className="military-select"
                                required
                            >
                                <option value="">Seleccione el Personal Militar</option>
                                {personal.map((p) => (
                                    <option 
                                        key={p.cedula} 
                                        value={p.cedula}
                                        disabled={p.activo === false}
                                        style={p.activo === false ? { color: '#ff7675' } : {}}
                                    >
                                        [{p.grado}] - {p.nombre} {p.apellido} (C.I: {p.cedula}){p.activo === false ? ' [INACTIVO]' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SECCIÓN DE MATERIALES DINÁMICOS */}
                    <div className="form-group form-group-full" style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Materiales a Asignar
                            </h3>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ padding: '10px 18px', fontSize: '13px' }}
                                onClick={agregarMaterial}
                            >
                                <FaPlus /> Material
                            </button>
                        </div>

                        {materiales.map((item, index) => (
                            <div
                                key={`${item.inventario_id}-${index}`}
                                className="materials-row"
                            >
                                {/* SELECT MATERIAL */}
                                <div className="input-icon-wrapper">
                                    <FaBoxes />
                                    <select
                                        value={item.inventario_id}
                                        onChange={(e) =>
                                            cambiarMaterial(index, "inventario_id", e.target.value)
                                        }
                                        className="military-select"
                                        required
                                    >
                                        <option value="">Seleccione el Material</option>
                                        {inventario.map((m) => (
                                            <option key={m.id} value={m.id} disabled={Number(m.cantidad) <= 0}>
                                                {m.nombre_material} {Number(m.cantidad) <= 0 ? "(SIN STOCK)" : `(Stock: ${m.cantidad})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* CANTIDAD */}
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={item.cantidad}
                                    onChange={(e) =>
                                        cambiarMaterial(index, "cantidad", e.target.value)
                                    }
                                    className="military-input"
                                    style={{ paddingLeft: '16px' }}
                                    min="1"
                                    required
                                />

                                {/* ELIMINAR FILA */}
                                <button
                                    type="button"
                                    className="action-btn action-btn-delete delete-btn"
                                    onClick={() => eliminarMaterial(index)}
                                    title="Quitar material"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* OBSERVACIONES */}
                    <div className="form-group form-group-full">
                        <label className="military-label">Causa del Pedido</label>
                        <div className="input-icon-wrapper" style={{ alignItems: 'flex-start' }}>
                            <FaRegCommentAlt style={{ top: '18px' }} />
                            <textarea
                                placeholder="Escriba la causa del pedido...Eje: Operaciones,misiones, etc."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                className="military-textarea"
                                style={{ paddingLeft: '54px' }}
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* REGISTRAR */}
                    <button type="submit" className="btn btn-primary form-group-full" style={{ marginTop: '10px' }}>
                        Registrar Pedido
                    </button>
                </form>
            </div>

            {/* SUCCESS MODAL FOR PDF DOWNLOAD */}
            {showSuccessModal && successData.militar && (
                <div className="tactical-modal-overlay">
                    <div className="tactical-modal" style={{ maxWidth: '460px' }}>
                        <div className="tactical-modal-header" style={{ background: 'rgba(39, 174, 96, 0.15)' }}>
                            <h3 className="tactical-modal-title" style={{ color: 'var(--success)' }}>
                                <FaCheckCircle /> Pedido Registrado
                            </h3>
                            <button className="tactical-modal-close" onClick={() => setShowSuccessModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="tactical-modal-body" style={{ textAlign: 'center', padding: '30px 24px' }}>
                            <FaCheckCircle style={{ fontSize: '64px', color: 'var(--success)', marginBottom: '16px', display: 'block', margin: '0 auto' }} />
                            <h4 style={{ fontSize: '18px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>¡Registro Completo!</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                                El pedido para el militar <strong>{successData.militar.grado} {successData.militar.nombre} {successData.militar.apellido}</strong> ha sido cargado con éxito. Descargue el acta de entrega firmable a continuación.
                            </p>

                            <button 
                                className="btn btn-gold" 
                                style={{ width: '100%', marginBottom: '12px' }}
                                onClick={() => generarPDFPedido(successData)}
                            >
                                <FaDownload /> Descargar Acta (PDF)
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                style={{ width: '100%' }}
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EntregaMaterial;