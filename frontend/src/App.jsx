import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// PÁGINAS

import Login from "./pages/Login";
import Menu from "./pages/Menu";

import Personal from "./pages/Personal";
import TablaPersonal from "./pages/TablaPersonal";

import Inventario from "./pages/Inventario";
import TablaInventario from "./pages/TablaInventario";
import HistorialInventario from "./pages/HistorialInventario";

import EntregaMaterial from "./pages/EntregaMaterial";
import HistorialEntregas from "./pages/HistorialEntregas";
import ReportesGenerales from "./pages/ReportesGenerales";
import MalEstado from "./pages/MalEstado";

// RUTA PROTEGIDA

function RutaProtegida({ children }) {

    const auth = localStorage.getItem("login");

    return auth
        ? children
        : <Navigate to="/login" replace />;

}

function RutaAdmin({ children }) {

    const rol = localStorage.getItem("rol");

    if (rol === "personal") {
        return <Navigate to="/historial-entregas" replace />;
    }

    return children;

}

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* PANEL PRINCIPAL */}

                <Route
                    path="/"
                    element={
                        <RutaProtegida>
                            <Menu />
                        </RutaProtegida>
                    }
                >

                    {/* REDIRECCIÓN INICIAL SEGÚN ROL */}
                    <Route
                        index
                        element={
                            localStorage.getItem("rol") === "personal"
                                ? <Navigate to="/historial-entregas" replace />
                                : <Navigate to="/personal" replace />
                        }
                    />

                    {/* PERSONAL (ADMIN) */}

                    <Route
                        path="personal"
                        element={
                            <RutaAdmin>
                                <Personal />
                            </RutaAdmin>
                        }
                    />

                    <Route
                        path="tabla-personal"
                        element={
                            <RutaAdmin>
                                <TablaPersonal />
                            </RutaAdmin>
                        }
                    />

                    {/* INVENTARIO (ADMIN) */}

                    <Route
                        path="inventario"
                        element={
                            <RutaAdmin>
                                <Inventario />
                            </RutaAdmin>
                        }
                    />

                    <Route
                        path="tabla-inventario"
                        element={
                            <RutaAdmin>
                                <TablaInventario />
                            </RutaAdmin>
                        }
                    />

                    <Route
                        path="historial-inventario"
                        element={
                            <RutaAdmin>
                                <HistorialInventario />
                            </RutaAdmin>
                        }
                    />

                    {/* ENTREGAS */}

                    <Route
                        path="entrega-material"
                        element={
                            <RutaAdmin>
                                <EntregaMaterial />
                            </RutaAdmin>
                        }
                    />

                    <Route path="historial-entregas" element={<HistorialEntregas />} />

                    <Route 
                        path="reportes-generales" 
                        element={
                            <RutaAdmin>
                                <ReportesGenerales />
                            </RutaAdmin>
                        } 
                    />

                    <Route 
                        path="mal-estado" 
                        element={
                            <RutaAdmin>
                                <MalEstado />
                            </RutaAdmin>
                        } 
                    />

                </Route>

                {/* REDIRECCIÓN */}

                <Route
                    path="*"
                    element={<Navigate to="/login" />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;