import { useEffect, useState, useMemo, Fragment } from "react";
import { 
    FaHistory, 
    FaSearch, 
    FaCalendarAlt, 
    FaUserShield, 
    FaBoxes, 
    FaUndo,
    FaTimes,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationTriangle,
    FaDownload,
    FaTrash,
    FaAngleDown,
    FaAngleRight,
    FaFilePdf
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoGiron from "../assets/logo_giron.png";




function HistorialEntregas() {
    const [busqueda, setBusqueda] = useState('');
    const [historial, setHistorial] = useState([]);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnItem, setReturnItem] = useState(null);
    const [returnQty, setReturnQty] = useState(0);
    const [returnCause, setReturnCause] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [fechaBusqueda, setFechaBusqueda] = useState('');

    const rol = localStorage.getItem('rol');
    const cedulaMilitar = localStorage.getItem('cedula');
    const nombreMilitar = localStorage.getItem('nombre');
    const esPersonal = rol === 'personal';

    const cargarHistorial = async () => {
        try {
            const url = esPersonal && cedulaMilitar
                ? `http://localhost:3000/api/historial-entregas?cedula=${encodeURIComponent(cedulaMilitar)}`
                : 'http://localhost:3000/api/historial-entregas';

            const res = await fetch(url);
            const data = await res.json();
            
            // Garantizar que si es militar solo se carguen sus propias actas
            const dataFinal = esPersonal && cedulaMilitar
                ? data.filter(item => String(item.cedula).trim() === String(cedulaMilitar).trim())
                : data;

            setHistorial(dataFinal);
            
            // Expandir de forma automática todas las filas al cargar
            const allExpanded = {};
            dataFinal.forEach(item => {
                allExpanded[item.entrega_id] = true;
            });
            setExpandedRows(allExpanded);
        } catch (err) {
            console.error('Error al cargar historial', err);
        }
    };
    useEffect(() => {
        cargarHistorial();
    }, []);

    const openReturnModal = (item) => {
        setReturnItem(item);
        setReturnQty(1);
        setReturnCause('');
        setShowReturnModal(true);
    };
    
   const generarPDFPedido = (item) => {

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

    doc.addImage(
        logoGiron,
        "PNG",
        10,
        4,
        22,
        22
    );

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

    const fechaFormateada = new Date(
        item.fecha_entrega
    ).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    doc.setFillColor(...grisClaro);

    doc.roundedRect(
        10,
        42,
        190,
        22,
        3,
        3,
        "F"
    );

    doc.setTextColor(0);

    doc.setFontSize(11);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        `ACTA N° ${String(item.entrega_id).padStart(5, "0")}`,
        15,
        50
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        `Fecha de entrega: ${fechaFormateada}`,
        15,
        58
    );

    /* ===========================
       DATOS DEL SOLICITANTE
    =========================== */

    doc.setFillColor(...verde);

    doc.rect(
        10,
        72,
        190,
        8,
        "F"
    );

    doc.setTextColor(255);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "DATOS DEL SOLICITANTE",
        15,
        77
    );

    doc.setTextColor(0);

    doc.roundedRect(
        10,
        80,
        190,
        28,
        2,
        2
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        `Grado: ${item.grado}`,
        15,
        90
    );

    doc.text(
        `Nombre: ${item.nombre} ${item.apellido}`,
        15,
        98
    );

    doc.text(
        `Cédula: ${item.cedula}`,
        120,
        90
    );

    /* ===========================
       TABLA DE MATERIALES
    =========================== */

    const tableRows = (item.detalles || []).map(
        (detalle, idx) => [
            idx + 1,
            detalle.nombre_material,
            detalle.cantidad,
            "ENTREGADO"
        ]
    );

    autoTable(doc, {
        startY: 118,

        head: [[
            "N°",
            "MATERIAL",
            "CANTIDAD",
            "ESTADO"
        ]],

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
                cellWidth: 25
            },
            3: {
                halign: "center",
                cellWidth: 30
            }
        }
    });

    /* ===========================
       RESUMEN
    =========================== */

    const totalMateriales =
        (item.detalles || []).reduce(
            (acc, actual) =>
                acc + Number(actual.cantidad),
            0
        );

    let finalY =
        doc.lastAutoTable.finalY + 10;

    doc.setFillColor(...grisClaro);

    doc.roundedRect(
        10,
        finalY,
        190,
        18,
        2,
        2,
        "F"
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        `Total de materiales entregados: ${totalMateriales}`,
        15,
        finalY + 7
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        `Registros entregados: ${(item.detalles || []).length}`,
        15,
        finalY + 14
    );

    /* ===========================
       OBSERVACIONES
    =========================== */

    finalY += 25;

    doc.setFillColor(...verde);

    doc.rect(
        10,
        finalY,
        190,
        8,
        "F"
    );

    doc.setTextColor(255);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "OBSERVACIONES",
        15,
        finalY + 5.5
    );

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

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        doc.splitTextToSize(
            item.observaciones ||
            "Sin observaciones registradas.",
            180
        ),
        15,
        finalY + 8
    );

    /* ===========================
       FIRMAS
    =========================== */

    finalY += 45;

    if (finalY > 260) {
        doc.addPage();
        finalY = 40;
    }

    doc.setDrawColor(...dorado);

    doc.line(
        25,
        finalY,
        85,
        finalY
    );

    doc.line(
        125,
        finalY,
        185,
        finalY
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "RESPONSABLE DE LOGÍSTICA",
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

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        "Firma Responsable Bodega",
        55,
        finalY + 14,
        { align: "center" }
    );

    doc.text(
        `${item.grado} ${item.nombre} ${item.apellido}`,
        155,
        finalY + 14,
        { align: "center" }
    );

    doc.text(
        `C.I. ${item.cedula}`,
        155,
        finalY + 20,
        { align: "center" }
    );

    /* ===========================
       PIE DE PÁGINA
    =========================== */

    doc.setDrawColor(...dorado);

    doc.line(
        10,
        285,
        200,
        285
    );

    doc.setFontSize(8);
    doc.setTextColor(80);

    doc.text(
        "Batallón de Logística Nº73 'Girón' - Sistema de Gestión de Materiales",
        105,
        290,
        { align: "center" }
    );

    doc.save(
        `ACTA_PEDIDO_${String(item.entrega_id).padStart(5, "0")}.pdf`
    );
};
    /*onst generarPDFPedido = (item) => {
        const doc = new jsPDF();
        
        // Encabezado oficial militar
        doc.setFillColor(18, 24, 17); // Verde militar oscuro
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(212, 175, 55); // Oro
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FUERZAS ARMADAS - DEPARTAMENTO DE LOGÍSTICA", 105, 12, { align: "center" });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("ACTA OFICIAL DE PEDIDO DE MATERIAL", 105, 20, { align: "center" });
        
        // Datos del acta
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`ACTA Nro: #${String(item.entrega_id).padStart(5, '0')}`, 15, 45);
        
        const fechaFormateada = new Date(item.fecha_entrega).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha y Hora: ${fechaFormateada}`, 115, 45);
        
        // Línea divisoria
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(1);
        doc.line(15, 50, 195, 50);
        
        // Datos del receptor militar
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("DATOS DEL SOLICITANTE", 15, 60);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Rango: ${item.grado}`, 15, 68);
        doc.text(`Nombre Completo: ${item.nombre} ${item.apellido}`, 15, 75);
        doc.text(`Cédula de Identidad: ${item.cedula}`, 15, 82);
        
        // Tabla de materiales
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("MATERIALES ADQUIRIDOS", 15, 95);
        
        const tableRows = item.detalles.map((d, index) => [
            index + 1,
            d.nombre_material,
            d.cantidad,
            "Adquirido"
        ]);
        
        autoTable(doc, {
            startY: 100,
            head: [['Nro.', 'Descripción del Material', 'Cantidad', 'Estado']],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [61, 82, 32], textColor: [255, 255, 255] },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { width: 15 },
                2: { width: 30, halign: 'center' },
                3: { width: 30 }
            }
        });
        
        // Observaciones
        let finalY = doc.lastAutoTable.finalY + 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("OBSERVACIONES / DETALLES DE ASIGNACIÓN:", 15, finalY);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitObs = doc.splitTextToSize(item.observaciones || "Sin observaciones registradas.", 180);
        doc.text(splitObs, 15, finalY + 7);
        
        // Bloque de firmas
        finalY += splitObs.length * 5 + 30;
        if (finalY > 260) {
            doc.addPage();
            finalY = 40;
        }
        
        doc.setDrawColor(150, 150, 150);
        doc.line(25, finalY, 85, finalY);
        doc.line(125, finalY, 185, finalY);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("ENTREGADO POR", 55, finalY + 5, { align: "center" });
        doc.text("RECIBÍ CONFORME", 155, finalY + 5, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.text("Firma Responsable Logística", 55, finalY + 10, { align: "center" });
        doc.text(`${item.grado} ${item.nombre} ${item.apellido}`, 155, finalY + 10, { align: "center" });
        doc.text(`C.I. ${item.cedula}`, 155, finalY + 15, { align: "center" });
        
        doc.save(`ACTA_PEDIDO_${String(item.entrega_id).padStart(5, '0')}.pdf`);
    };*/

    const generarPDFDevolucion = async (item, nuevaDevolucion = null) => {
    let devolucionesList = [];

    if (nuevaDevolucion) {
        devolucionesList = [
            {
                fecha_devolucion: nuevaDevolucion.fecha_devolucion,
                cantidad_devuelta: nuevaDevolucion.cantidad_devuelta,
                causa: nuevaDevolucion.causa
            }
        ];
    } else {
        try {
            const res = await fetch(
                `http://localhost:3000/api/devoluciones/entrega/${item.entrega_id}`
            );

            if (res.ok) {
                devolucionesList = await res.json();
            }
        } catch (err) {
            console.error("Error al cargar devoluciones", err);
        }
    }

    if (!devolucionesList.length) {
        alert("No existen devoluciones registradas.");
        return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    const verde = [33, 52, 28];
    const dorado = [212, 175, 55];

    const img = new Image();
    img.src = logoGiron;

    img.onload = () => {

        /* =====================================
           CABECERA
        ===================================== */

        doc.setFillColor(...verde);
        doc.rect(0, 0, 210, 35, "F");

        doc.addImage(
            img,
            "PNG",
            10,
            4,
            24,
            24
        );

        doc.setTextColor(...dorado);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);

        doc.text(
            "BATALLÓN DE LOGÍSTICA N° 73 'GIRÓN'",
            105,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);

        doc.text(
            "LOGÍSTICA PODER DE COMBATE",
            105,
            20,
            { align: "center" }
        );

        doc.setTextColor(255, 255, 255);

        doc.text(
            "ACTA OFICIAL DE DEVOLUCIÓN DE MATERIAL",
            105,
            28,
            { align: "center" }
        );

        /* =====================================
           DATOS ACTA
        ===================================== */

        const fechaPedido = new Date(
            item.fecha_entrega
        ).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        doc.setFillColor(245, 245, 245);

        doc.roundedRect(
            10,
            42,
            190,
            20,
            3,
            3,
            "F"
        );

        doc.setTextColor(0);

        doc.setFont("helvetica", "bold");

        doc.text(
            `ACTA REFERENCIA N° ${String(item.entrega_id).padStart(
                5,
                "0"
            )}`,
            15,
            50
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `Fecha entrega original: ${fechaPedido}`,
            15,
            58
        );

        /* =====================================
           DATOS DEL MILITAR
        ===================================== */

        doc.setFillColor(...verde);

        doc.rect(
            10,
            70,
            190,
            8,
            "F"
        );

        doc.setTextColor(255);

        doc.setFont("helvetica", "bold");

        doc.text(
            "DATOS DEL PERSONAL MILITAR",
            15,
            75
        );

        doc.setTextColor(0);

        doc.roundedRect(
            10,
            78,
            190,
            28,
            2,
            2
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `Grado: ${item.grado || ""}`,
            15,
            88
        );

        doc.text(
            `Nombre: ${item.nombre || ""} ${item.apellido || ""}`,
            15,
            96
        );

        doc.text(
            `C.I.: ${item.cedula || ""}`,
            120,
            88
        );

        /* =====================================
           MATERIALES ORIGINALES
        ===================================== */

        const materialesOriginales =
            (item.detalles || [item]).map(
                (det, index) => [
                    index + 1,
                    det.nombre_material,
                    det.cantidad
                ]
            );

        autoTable(doc, {
            startY: 115,

            head: [
                [
                    "N°",
                    "MATERIAL ENTREGADO",
                    "CANTIDAD"
                ]
            ],

            body: materialesOriginales,

            theme: "grid",

            headStyles: {
                fillColor: verde,
                textColor: [255, 255, 255]
            },

            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        /* =====================================
           DEVOLUCIONES
        ===================================== */

        const tableRows = devolucionesList.map(
            (dev, idx) => {
                const fechaDev = new Date(
                    dev.fecha_devolucion
                ).toLocaleString("es-ES");

                return [
                    idx + 1,
                    fechaDev,
                    dev.nombre_material ||
                        item.nombre_material ||
                        "N/A",
                    dev.cantidad_devuelta,
                    dev.causa
                ];
            }
        );

        doc.setFont("helvetica", "bold");

        doc.text(
            "HISTORIAL DE DEVOLUCIONES",
            14,
            doc.lastAutoTable.finalY + 12
        );

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 16,

            head: [[
                "N°",
                "Fecha",
                "Material",
                "Cantidad",
                "Observación"
            ]],

            body: tableRows,

            theme: "grid",

            headStyles: {
                fillColor: [120, 30, 30],
                textColor: [255, 255, 255]
            },

            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },

            styles: {
                fontSize: 9
            }
        });

        /* =====================================
           RESUMEN
        ===================================== */

        const totalDevuelto =
            devolucionesList.reduce(
                (acc, dev) =>
                    acc + Number(dev.cantidad_devuelta),
                0
            );

        let finalY =
            doc.lastAutoTable.finalY + 12;

        doc.roundedRect(
            10,
            finalY,
            190,
            18,
            2,
            2
        );

        doc.setFont("helvetica", "bold");

        doc.text(
            `Total devuelto: ${totalDevuelto} unidades`,
            15,
            finalY + 7
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `Número de devoluciones: ${devolucionesList.length}`,
            15,
            finalY + 14
        );

        /* =====================================
           FIRMAS
        ===================================== */

        finalY += 40;

        doc.line(25, finalY, 85, finalY);
        doc.line(125, finalY, 185, finalY);

        doc.setFont("helvetica", "bold");

        doc.text(
            "RESPONSABLE BODEGA",
            55,
            finalY + 6,
            { align: "center" }
        );

        doc.text(
            "PERSONAL MILITAR",
            155,
            finalY + 6,
            { align: "center" }
        );

        doc.setFont("helvetica", "normal");

        doc.text(
            `${item.grado} ${item.nombre} ${item.apellido}`,
            155,
            finalY + 15,
            { align: "center" }
        );

        doc.text(
            `C.I. ${item.cedula}`,
            155,
            finalY + 21,
            { align: "center" }
        );

        /* =====================================
           PIE DE PAGINA
        ===================================== */

        doc.setDrawColor(...dorado);

        doc.line(
            10,
            285,
            200,
            285
        );

        doc.setFontSize(8);

        doc.text(
            "Batallón de Logística N°73 'Girón' - Sistema de Gestión de Materiales",
            105,
            290,
            { align: "center" }
        );

        doc.save(
            `ACTA_DEVOLUCION_${String(item.entrega_id).padStart(5, "0")}.pdf`
        );
    };

    img.onerror = () => {
        alert(
            "No se encontró el archivo logo_giron.png en la carpeta public."
        );
    };
};

    const handleReturnSubmit = async () => {
        if (!returnQty || !returnCause) {
            alert('Complete cantidad y observaciones de devolución');
            return;
        }
        const maxQty = returnItem.cantidad - returnItem.cantidad_devuelta;
        if (returnQty > maxQty) {
            alert(`La cantidad a devolver (${returnQty}) supera lo disponible (${maxQty}).`);
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/devoluciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    detalle_entrega_id: returnItem.detalle_id,
                    cantidad_devuelta: returnQty,
                    causa: returnCause
                })
            });
            const data = await res.json();
            alert(data.mensaje || 'Devolución registrada');
            if (res.ok) {
                // Generar y descargar reporte PDF inmediatamente
                generarPDFDevolucion(returnItem, data.devolucion);
                
                // Refresh historial
                cargarHistorial();
                setShowReturnModal(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePedido = async (item) => {
        const restante = item.cantidad - item.cantidad_devuelta;
        const confirmacion = window.confirm(
            `¿Está seguro de eliminar este registro de pedido?\n\n` +
            `Personal: ${item.grado} ${item.nombre} ${item.apellido}\n` +
            `Material: ${item.nombre_material}\n` +
            `Se reintegrarán ${restante} unidades al stock del inventario.`
        );

        if (!confirmacion) return;

        try {
            const res = await fetch(`http://localhost:3000/api/entregas/detalle/${item.detalle_id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            alert(data.mensaje);
            if (res.ok) {
                cargarHistorial();
            }
        } catch (err) {
            console.error("Error al eliminar pedido:", err);
            alert("No se pudo eliminar el pedido.");
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // ======================================
    // BUSQUEDA CLIENT-SIDE
    // ======================================
    const groupedHistorial = useMemo(() => {
        const groups = {};
        historial.forEach(item => {
            if (!groups[item.entrega_id]) {
                groups[item.entrega_id] = {
                    ...item,
                    detalles: []
                };
            }
            groups[item.entrega_id].detalles.push(item);
        });
        return Object.values(groups).sort((a, b) => b.entrega_id - a.entrega_id);
    }, [historial]);

    const historialFiltrado = groupedHistorial.filter((group) => {
        const busquedaLower = busqueda.toLowerCase();
        const coincideTexto = (
            group.nombre.toLowerCase().includes(busquedaLower) ||
            group.apellido.toLowerCase().includes(busquedaLower) ||
            group.cedula.includes(busquedaLower) ||
            group.detalles.some(d => d.nombre_material.toLowerCase().includes(busquedaLower)) ||
            group.grado.toLowerCase().includes(busquedaLower)
        );

        let coincideFecha = true;
        if (fechaBusqueda) {
            const fechaEntrega = new Date(group.fecha_entrega);
            const entregaYear = fechaEntrega.getFullYear();
            const entregaMonth = String(fechaEntrega.getMonth() + 1).padStart(2, '0');
            const entregaDay = String(fechaEntrega.getDate()).padStart(2, '0');
            const entregaString = `${entregaYear}-${entregaMonth}-${entregaDay}`;
            
            if (entregaString !== fechaBusqueda) {
                coincideFecha = false;
            }
        }

        return coincideTexto && coincideFecha;
    });

    return (
        <>
        <div className="military-container">
            <div className="military-card">
                {/* HEADER */}
                <div className="page-header">
                    <div className="page-logo-container">
                        <FaHistory />
                    </div>
                    <h1 className="page-title">
                        {esPersonal ? <>Mis <span>Pedidos</span></> : <>Historial <span>Pedidos</span></>}
                    </h1>
                    <p className="page-subtitle">
                        {esPersonal
                            ? `Actas de entrega, dotación y devoluciones registradas a nombre de: ${nombreMilitar || 'Personal Militar'} (C.I: ${cedulaMilitar})`
                            : 'Registro de actas, control de pedidos y devoluciones de material al personal'
                        }
                    </p>
                </div>

                {/* MENSAJE EXCLUSIVO SI ES PERSONAL Y NO REGISTRA PEDIDOS */}
                {esPersonal && historial.length === 0 ? (
                    <div style={{
                        padding: '50px 24px',
                        textAlign: 'center',
                        background: 'rgba(212, 175, 55, 0.04)',
                        border: '1px dashed rgba(212, 175, 55, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        margin: '20px 0 30px'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'rgba(212, 175, 55, 0.1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            color: 'var(--accent-gold)',
                            marginBottom: '16px'
                        }}>
                            <FaInfoCircle />
                        </div>
                        <h2 style={{ fontSize: '22px', color: 'var(--accent-gold)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            No se registran pedidos
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
                            Estimado/a <strong>{nombreMilitar || 'Personal Militar'}</strong> (C.I: {cedulaMilitar}), actualmente <strong>no registra pedidos de material</strong> ni actas de entrega asignadas a su nombre en la base de datos.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* CONTROLES */}
                        <div className="table-controls" style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                                <div className="search-wrapper" style={{ minWidth: '280px', flex: 1 }}>
                                    <div className="input-icon-wrapper" style={{ height: '48px' }}>
                                        <FaSearch />
                                        <input
                                            type="text"
                                            placeholder={esPersonal ? "Buscar por Material o Nro. de Acta..." : "Buscar por Militar, Cédula o Material..."}
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            className="military-input"
                                            style={{ padding: '12px 12px 12px 54px' }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="date-filter-wrapper" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div className="input-icon-wrapper" style={{ height: '48px' }}>
                                        <FaCalendarAlt style={{ left: '16px', color: 'var(--text-muted)' }} />
                                        <input
                                            type="date"
                                            value={fechaBusqueda}
                                            onChange={(e) => setFechaBusqueda(e.target.value)}
                                            className="military-input"
                                            style={{ padding: '12px 12px 12px 48px', width: '170px', colorScheme: 'dark' }}
                                            title="Buscar por Fecha"
                                        />
                                    </div>
                                    {fechaBusqueda && (
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0 16px', height: '48px', minHeight: '48px' }} 
                                            onClick={() => setFechaBusqueda('')}
                                            title="Limpiar filtro de fecha"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {esPersonal ? "Mis entregas:" : "Entregas registradas:"} <strong>{historialFiltrado.length}</strong>
                            </div>
                        </div>

                        {/* TABLA */}
                        <div className="table-container">
                            <table className="military-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                <colgroup>
                                    <col style={{ width: '36px' }} />
                                    <col style={{ width: '90px' }} />
                                    <col style={{ width: '150px' }} />
                                    <col style={{ width: '220px' }} />
                                    <col style={{ width: '180px' }} />
                                    <col style={{ width: '100px' }} />
                                    <col style={{ width: '110px' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nro. Acta</th>
                                        <th>Fecha</th>
                                        <th>Personal</th>
                                        <th>Materiales</th>
                                        <th>Estado</th>
                                        <th style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {historialFiltrado.length > 0 ? (
                                        historialFiltrado.map((group) => (
                                            <Fragment key={group.entrega_id}>
                                                {/* FILA PRINCIPAL DEL ACTA */}
                                                <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                                    <td style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleRow(group.entrega_id)}>
                                                        {expandedRows[group.entrega_id] ? <FaAngleDown /> : <FaAngleRight />}
                                                    </td>
                                                    <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent-gold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        #{String(group.entrega_id).padStart(5, '0')}
                                                    </td>
                                                    <td style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {new Date(group.fecha_entrega).toLocaleString("es-ES")}
                                                    </td>
                                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                                                        {group.grado} {group.nombre} {group.apellido}
                                                    </td>
                                                    <td style={{ overflow: 'hidden' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{group.detalles.length} {group.detalles.length === 1 ? 'material' : 'materiales'}</span>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={group.detalles.map(d => `${d.cantidad}x ${d.nombre_material}`).join(', ')}>
                                                                {group.detalles.map(d => `${d.cantidad}x ${d.nombre_material}`).join(', ')}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {(() => {
                                                            const totalEntregado = group.detalles.reduce((acc, d) => acc + d.cantidad, 0);
                                                            const totalDevuelto = group.detalles.reduce((acc, d) => acc + d.cantidad_devuelta, 0);
                                                            if (totalDevuelto === 0) return <span className="badge badge-info">Entregado</span>;
                                                            if (totalDevuelto === totalEntregado) return <span className="badge badge-success">Completo</span>;
                                                            return <span className="badge badge-warning">Parcial</span>;
                                                        })()}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                            <button className="action-btn action-btn-edit" title="Ver / Descargar Acta de Pedido PDF" onClick={() => generarPDFPedido(group)}>
                                                                <FaDownload />
                                                            </button>
                                                            {group.detalles.some(d => d.cantidad_devuelta > 0) && (
                                                                <button className="action-btn action-btn-delete" title="Ver / Descargar Acta Devolución PDF" onClick={() => generarPDFDevolucion(group)}>
                                                                    <FaFilePdf />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* SUB-FILAS DE DETALLE */}
                                                {expandedRows[group.entrega_id] && group.detalles.map((item) => (
                                                    <tr key={item.detalle_id} style={{
                                                        backgroundColor: 'rgba(0, 0, 0, 0.22)',
                                                        borderLeft: '3px solid var(--accent-gold)',
                                                    }}>
                                                        <td></td>
                                                        <td></td>
                                                        <td colSpan="2" style={{ paddingLeft: '16px', paddingRight: '8px', overflow: 'hidden' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <FaBoxes style={{ color: 'var(--accent-gold)', fontSize: '11px', flexShrink: 0 }} />
                                                                <span style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {item.nombre_material}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', paddingLeft: '17px' }}>
                                                                Entregado: <strong>{item.cantidad}</strong> &nbsp;|&nbsp; Devuelto: <strong style={{ color: item.cantidad_devuelta > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>{item.cantidad_devuelta}</strong>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                                    {item.cantidad_devuelta}/{item.cantidad}
                                                                </div>
                                                                <progress value={item.cantidad_devuelta} max={item.cantidad} style={{ width: '100%', height: '6px' }} />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {item.cantidad_devuelta === 0 && <span className="badge badge-info" style={{ fontSize: '10px' }}>Sin devolver</span>}
                                                            {item.cantidad_devuelta > 0 && item.cantidad_devuelta < item.cantidad && <span className="badge badge-warning" style={{ fontSize: '10px' }}>Parcial</span>}
                                                            {item.cantidad_devuelta === item.cantidad && <span className="badge badge-success" style={{ fontSize: '10px' }}>Completo</span>}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                                {item.cantidad_devuelta < item.cantidad && !esPersonal && (
                                                                    <button className="action-btn action-btn-save" title="Registrar Devolución" onClick={() => openReturnModal(item)}>
                                                                        <FaUndo />
                                                                    </button>
                                                                )}
                                                                {item.cantidad_devuelta > 0 && (
                                                                    <button className="action-btn action-btn-delete" title="Ver / Descargar PDF Devolución" onClick={() => generarPDFDevolucion(item)}>
                                                                        <FaDownload />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                                {esPersonal ? "No se registran pedidos a su nombre." : "No se encontraron actas de entrega."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* RETURN MODAL */}
        {showReturnModal && returnItem && (
            <div className="tactical-modal-overlay">
                <div className="tactical-modal">
                    {/* Header */}
                    <div className="tactical-modal-header">
                        <h3 className="tactical-modal-title">
                            <FaUndo style={{ color: 'var(--accent-gold)' }} /> Registrar Devolución
                        </h3>
                        <button className="tactical-modal-close" onClick={() => setShowReturnModal(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="tactical-modal-body">
                        <div className="tactical-info-box">
                            <div className="tactical-info-item">
                                <span className="tactical-info-label">Nro. Acta</span>
                                <span className="tactical-info-value">{String(returnItem.entrega_id).padStart(5, '0')}</span>
                            </div>
                            <div className="tactical-info-item">
                                <span className="tactical-info-label">Personal Militar</span>
                                <span className="tactical-info-value">{returnItem.grado} {returnItem.nombre} {returnItem.apellido}</span>
                            </div>
                            <div className="tactical-info-item">
                                <span className="tactical-info-label">Material</span>
                                <span className="tactical-info-value">{returnItem.nombre_material}</span>
                            </div>
                        </div>

                        {/* Cantidad a Devolver */}
                        <div className="form-group">
                <label className="military-label">Cantidad a devolver</label>
                <input 
                    type="number"
                    min="1"
                    max={returnItem.cantidad - returnItem.cantidad_devuelta}
                    value={returnQty}
                    onChange={(e) => setReturnQty(Number(e.target.value))}
                    className="military-input"
                />
                {/* Progress bar showing cumulative returned quantity */}
                <div style={{ marginTop: '8px' }}>
                    <label className="military-label" style={{ display: 'block', marginBottom: '4px' }}>
                        Progreso de devolución ({returnItem.cantidad_devuelta + returnQty}/{returnItem.cantidad})
                    </label>
                    <progress
                        value={returnItem.cantidad_devuelta + returnQty}
                        max={returnItem.cantidad}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

                        {/* Observaciones */}
                        <div className="form-group">
                            <label className="military-label">Observaciones</label>
                            <input 
                                type="text" 
                                list="observaciones-options"
                                value={returnCause} 
                                onChange={(e) => setReturnCause(e.target.value)} 
                                className="military-input" 
                                placeholder="Escriba o seleccione..."
                            />
                            <datalist id="observaciones-options">
                                <option value="Buen estado" />
                                <option value="Mal estado" />
                            </datalist>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="tactical-modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleReturnSubmit}>
                            <FaUndo /> Confirmar Devolución
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default HistorialEntregas;