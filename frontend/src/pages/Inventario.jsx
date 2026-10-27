import { useState } from 'react';
import {
    FaWarehouse,
    FaBoxes,
    FaLayerGroup,
    FaClipboardList
} from 'react-icons/fa';
import API_URL from '../config/api';

function Inventario() {
    const [nombreMaterial, setNombreMaterial] = useState('');
    const [tipoMaterial, setTipoMaterial] = useState('');
    const [cantidad, setCantidad] = useState('');

    const guardarInventario = async (e) => {
        e.preventDefault();

        const datos = {
            nombre_material: nombreMaterial,
            tipo_material: tipoMaterial,
            cantidad: Number(cantidad)
        };

        try {
            const respuesta = await fetch(
                `${API_URL}/api/guardar-bodega`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                }
            );

            const data = await respuesta.json();
            alert(data.mensaje);

            if (respuesta.ok) {
                setNombreMaterial('');
                setTipoMaterial('');
                setCantidad('');
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
                        <FaWarehouse />
                    </div>
                    <h1 className="page-title">
                        Inventario <span>Militar</span>
                    </h1>
                    <p className="page-subtitle">
                        Sistema de registro, abastecimiento y control de materiales en bodega
                    </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={guardarInventario} className="military-form">
                    {/* MATERIAL */}
                    <div className="form-group">
                        <label className="military-label">Nombre del Material</label>
                        <div className="input-icon-wrapper">
                            <FaBoxes />
                            <input
                                type="text"
                                placeholder="Ej: Casco táctico, Fusil HK, etc."
                                value={nombreMaterial}
                                onChange={(e) => setNombreMaterial(e.target.value)}
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* TIPO MATERIAL */}
                    <div className="form-group">
                        <label className="military-label">Tipo de Material</label>
                        <div className="input-icon-wrapper">
                            <FaLayerGroup />
                            <select
                                value={tipoMaterial}
                                onChange={(e) => setTipoMaterial(e.target.value)}
                                className="military-select"
                                required
                            >
                                <option value="">Seleccione Categoría</option>
                                <option value="Material Orgánico">Material Orgánico</option>
                                <option value="Material de Depósito">Material de Depósito</option>
                            </select>
                        </div>
                    </div>

                    {/* CANTIDAD */}
                    <div className="form-group form-group-full">
                        <label className="military-label">Cantidad / Stock Inicial</label>
                        <div className="input-icon-wrapper">
                            <FaClipboardList />
                            <input
                                type="number"
                                placeholder="Ingrese cantidad disponible"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                className="military-input"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    {/* BOTON GUARDAR */}
                    <button type="submit" className="btn btn-primary form-group-full">
                        Guardar en Inventario
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Inventario;