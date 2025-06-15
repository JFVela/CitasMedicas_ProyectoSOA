import { Routes, Route } from "react-router-dom";

// Pacientes
import PaginaPaciente from "./Pages/Paciente/PaginaPaciente";
import IngresarCita from "./Pages/Paciente/IngresarCita";
import ListaCitas from "./Pages/Paciente/ListaCitas";
import DetalleCita from "./Pages/Paciente/DetalleCita";

// Doctor
import PaginaDoctor from "./Pages/Doctor/PaginaDoctor";
import VerCitas from "./Pages/Doctor/VerCitas";

// Admin
import PaginaAdmin from "./Pages/Admin/PaginaAdmin";
import AgregarDoctor from "./Pages/Admin/AgregarDoctor";
import AgregarEspecialidad from "./Pages/Admin/AgregarEspecialidad";
import AgregarPaciente from "./Pages/Admin/AgregarPaciente";

// Página de Error 404
import Error404 from "./Pages/Error404";

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas del Paciente */}
      <Route path="/" element={<PaginaPaciente />}>
        <Route path="ingresar-cita" element={<IngresarCita />} />
        <Route path="lista-citas" element={<ListaCitas />} />
        <Route path="detalle-cita/:id" element={<DetalleCita />} />
      </Route>

      {/* Rutas del Doctor */}
      <Route path="/doctor" element={<PaginaDoctor />}>
        <Route path="ver-citas" element={<VerCitas />} />
      </Route>

      {/* Rutas del Admin */}
      <Route path="/admin" element={<PaginaAdmin />}>
        <Route path="gestionDoctor" element={<AgregarDoctor />} />
        <Route path="gestionEspecialidad" element={<AgregarEspecialidad />} />
        <Route path="gestionPaciente" element={<AgregarPaciente />} />
      </Route>

      {/* Ruta para errores */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default AppRoutes;
