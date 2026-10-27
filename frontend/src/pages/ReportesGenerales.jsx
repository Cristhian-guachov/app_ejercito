import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaUsers, FaArrowCircleRight } from 'react-icons/fa';
import API_URL from '../config/api';

const ReportesGenerales = () => {
  const generarReportePedidos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pedidos`);
      const pedidos = await res.json();

      const doc = new jsPDF();
      // Header
      doc.setFillColor(18, 24, 17);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('FUERZAS ARMADAS - DEPARTAMENTO DE LOGÍSTICA', 105, 12, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('REPORTE GENERAL DE PEDIDOS DE MATERIAL', 105, 20, { align: 'center' });

      // Table rows
      const tableRows = pedidos.map((p, idx) => [
        idx + 1,
        new Date(p.fecha_entrega).toLocaleString('es-ES'),
        `${p.grado} ${p.nombre} ${p.apellido}`,
        p.cedula,
        p.nombre_material,
        p.cantidad,
        p.observaciones || 'Sin observaciones.'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Nro.', 'Fecha', 'Personal', 'Cédula', 'Material', 'Cantidad', 'Observaciones']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [61, 82, 32], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });

      doc.save('Reporte_General_Pedidos.pdf');
    } catch (err) {
      console.error('Error generando reporte de pedidos', err);
      alert('No se pudo generar el reporte de pedidos.');
    }
  };

  const generarReporteMovimientos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/movimientos`);
      const movimientos = await res.json();

      const doc = new jsPDF();
      // Header
      doc.setFillColor(18, 24, 17);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('FUERZAS ARMADAS - DEPARTAMENTO DE LOGÍSTICA', 105, 12, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('REPORTE DE MOVIMIENTOS DEL PERSONAL', 105, 20, { align: 'center' });

      const tableRows = movimientos.map((m, idx) => [
        idx + 1,
        new Date(m.fecha).toLocaleString('es-ES'),
        m.tipo,
        `${m.grado} ${m.nombre} ${m.apellido}`,
        m.cedula,
        m.nombre_material,
        m.cantidad,
        m.observaciones || ''
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Nro.', 'Fecha', 'Tipo', 'Personal', 'Cédula', 'Material', 'Cantidad', 'Obs']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [61, 82, 32], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });

      doc.save('Reporte_Movimientos_Personal.pdf');
    } catch (err) {
      console.error('Error generando reporte de movimientos', err);
      alert('No se pudo generar el reporte de movimientos.');
    }
  };

  return (
    <div className="military-container">
      <div className="military-card">
        <div className="page-header">
          <div className="page-logo-container"><FaFilePdf /></div>
          <h1 className="page-title">Reportes <span>Generales</span></h1>
          <p className="page-subtitle">Exportar información consolidada del sistema</p>
        </div>
        <div className="table-controls" style={{ marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={generarReportePedidos}>
            <FaArrowCircleRight /> Descargar Reporte de Pedidos
          </button>
          <button className="btn btn-primary" onClick={generarReporteMovimientos}>
            <FaUsers /> Descargar Reporte de Movimientos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportesGenerales;
