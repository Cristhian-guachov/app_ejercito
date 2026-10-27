import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

function MalEstado() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/mal-estado")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="military-container">
        <div className="military-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-secondary)" }}>Cargando materiales en mal estado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="military-container">
        <div className="military-card" style={{ textAlign: "center", padding: "40px", borderColor: "var(--danger)" }}>
          <p style={{ color: "var(--danger)" }}>Error al cargar los datos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="military-container">
      <div className="military-card">
        {/* HEADER */}
        <div className="page-header">
          <div className="page-logo-container">
            <FaExclamationTriangle />
          </div>
          <h1 className="page-title">
            Materiales en <span>Mal Estado</span>
          </h1>
          <p className="page-subtitle">
            Registro y control de material dañado o inutilizable en el Comando Logístico
          </p>
        </div>

        {/* TABLA */}
        <div className="table-container">
          {data.length === 0 ? (
            <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
              No se encontraron registros de materiales en mal estado.
            </p>
          ) : (
            <table className="military-table">
              <thead>
                <tr>
                  <th>ID Registro</th>
                  <th>ID Devolución</th>
                  <th>Nro. Acta Pedido</th>
                  <th>Material</th>
                  <th style={{ textAlign: "center" }}>Cantidad</th>
                  <th>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: "700", color: "var(--accent-gold)" }}>#{row.id}</td>
                    <td>{row.devolucion_id ? `#${row.devolucion_id}` : "N/A"}</td>
                    <td>{row.entrega_id ? `#${String(row.entrega_id).padStart(5, "0")}` : "N/A"}</td>
                    <td style={{ fontWeight: "600" }}>{row.nombre_material}</td>
                    <td style={{ textAlign: "center", color: "var(--danger)", fontWeight: "700" }}>
                      {row.cantidad}
                    </td>
                    <td>{new Date(row.fecha_registro).toLocaleString("es-ES")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default MalEstado;
