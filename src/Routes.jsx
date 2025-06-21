import { Routes, Route } from "react-router-dom";

// Pacientes
import PaginaPaciente from "./Pages/Paciente/PaginaPaciente";
import Agendar from "./Pages/Paciente/Agendar";
import Inicio from "./Pages/Paciente/Inicio"
import Login from "./Pages/Paciente/Login";

// Doctor
import PaginaDoctor from "./Pages/Doctor/PaginaDoctor";
import VerCitas from "./Pages/Doctor/VerCitas";

// Admin
import PaginaAdmin from "./Pages/Admin/PaginaAdmin";
import AgregarDoctor from "./Pages/Admin/AgregarDoctor";
import AgregarEspecialidad from "./Pages/Admin/AgregarEspecialidad";
import AgregarPaciente from "./Pages/Admin/AgregarPaciente";
import CrudSede from "./Pages/Admin/GestionSede";

// Página de Error 404
import Error404 from "./Pages/Error404";

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas del Paciente */}
      <Route path="/" element={<PaginaPaciente />}>
        <Route index element={<Inicio />} />
        <Route path="agendar" element={<Agendar />} />
        <Route path="login" element={<Login />} />
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
        <Route path="gestionSede" element={<CrudSede />} />
      </Route>

      {/* Ruta para errores */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default AppRoutes;
