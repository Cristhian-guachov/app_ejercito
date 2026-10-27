import { useState } from 'react';
import {
    FaUserShield,
    FaIdCard,
    FaMedal,
    FaUser,
    FaCrosshairs
} from 'react-icons/fa';
import API_URL from '../config/api';

function Personal() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        tipo_arma: '',
        grado: '',
        cedula: '',
        activo: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // VALIDAR CEDULA (solo digitos, maximo 10)
        if (name === 'cedula') {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const guardarPersonal = async (e) => {
        e.preventDefault();

        if (formulario.cedula.length !== 10) {
            alert('La cédula debe tener 10 dígitos');
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/guardar-personal`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formulario)
                }
            );

            const data = await respuesta.json();
            alert(data.mensaje);

            if (respuesta.ok) {
                setFormulario({
                    nombre: '',
                    apellido: '',
                    tipo_arma: '',
                    grado: '',
                    cedula: '',
                    activo: true
                });
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
                        <FaUserShield />
                    </div>
                    <h1 className="page-title">
                        Registro <span>Militar</span>
                    </h1>
                    <p className="page-subtitle">
                        Sistema administrativo de control y registro de tropas
                    </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={guardarPersonal} className="military-form">
                    {/* NOMBRE */}
                    <div className="form-group">
                        <label className="military-label">Nombre</label>
                        <div className="input-icon-wrapper">
                            <FaUser />
                            <input
                                type="text"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese nombre"
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* APELLIDO */}
                    <div className="form-group">
                        <label className="military-label">Apellido</label>
                        <div className="input-icon-wrapper">
                            <FaUser />
                            <input
                                type="text"
                                name="apellido"
                                value={formulario.apellido}
                                onChange={handleChange}
                                placeholder="Ingrese apellido"
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* ARMA */}
                    <div className="form-group">
                        <label className="military-label">Tipo Arma</label>
                        <div className="input-icon-wrapper">
                            <FaCrosshairs />
                            <select
                                name="tipo_arma"
                                value={formulario.tipo_arma}
                                onChange={handleChange}
                                className="military-select"
                                required
                            >
                                <option value="">Seleccione Arma</option>
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
                        </div>
                    </div>

                    {/* GRADO */}
                    <div className="form-group">
                        <label className="military-label">Grado</label>
                        <div className="input-icon-wrapper">
                            <FaMedal />
                            <select
                                name="grado"
                                value={formulario.grado}
                                onChange={handleChange}
                                className="military-select"
                                required
                            >
                                <option value="">Seleccione Grado</option>
                                <option value="CRNL">CRNL (Coronel)</option>
                                <option value="TCRN">TCRN (Teniente Coronel)</option>
                                <option value="CAPT">CAPT (Capitán)</option>
                                <option value="CBOP">CBOP (Cabo Primero)</option>
                                <option value="CBOS">CBOS (Cabo Segundo)</option>
                                <option value="MAYO">MAYO (Mayor)</option>
                                <option value="SGOP">SGOP (Sargento Primero)</option>
                                <option value="SGOS">SGOS (Sargento Segundo)</option>
                                <option value="SLDO">SLDO (Soldado)</option>
                                <option value="SUBP">SUBP (Suboficial Primero)</option>
                                <option value="SUBT">SUBT (Subteniente) </option>
                                <option value="TNTE">TNTE (Teniente)</option>
                            </select>
                        </div>
                    </div>

                    {/* CEDULA */}
                    <div className="form-group form-group-full">
                        <label className="military-label">Cédula Militar</label>
                        <div className="input-icon-wrapper">
                            <FaIdCard />
                            <input
                                type="text"
                                name="cedula"
                                value={formulario.cedula}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="Ingrese cédula (10 dígitos)"
                                className="military-input"
                                required
                            />
                        </div>
                    </div>

                    {/* BOTON GUARDAR */}
                    <button type="submit" className="btn btn-primary form-group-full">
                        Guardar Personal Militar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Personal;