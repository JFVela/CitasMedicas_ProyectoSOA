import { Routes, Route } from "react-router-dom";

// Pacientes
import PaginaPaciente from "./Pages/Paciente/PaginaPaciente";
import Agendar from "./Pages/Paciente/Agendar";
import Inicio from "./Pages/Paciente/Inicio";
import Login from "./Pages/Paciente/Login";

// Doctor
import PaginaDoctor from "./Pages/Doctor/PaginaDoctor";
import InicioDoctor from "./Pages/Doctor/Inicio";
import Pacientes from "./Pages/Doctor/Pacientes";

// Admin
import InicioAdmin from "./Pages/Admin/Inicio";
import PaginaAdmin from "./Pages/Admin/PaginaAdmin";
import AgregarDoctor from "./Pages/Admin/AgregarDoctor";
import AgregarEspecialidad from "./Pages/Admin/AgregarEspecialidad";
import AgregarPaciente from "./Pages/Admin/AgregarPaciente";
import CrudSede from "./Pages/Admin/GestionSede";
import CrudHorario from "./Pages/Admin/GestionHorario";
import CrudDisponibilidad from "./Pages/Admin/GestionDisponibilidad";
import CrudCita from "./Pages/Admin/GestionCitas";
import CrudHistorial from "./Pages/Admin/GestionHistorial";

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
        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Rutas del Doctor */}
      <Route path="/doctor" element={<PaginaDoctor />}>
        <Route index element={<InicioDoctor />} />
        <Route path="pacientes" element={<Pacientes />} />

        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Rutas del Admin */}
      <Route path="/admin" element={<PaginaAdmin />}>
        <Route index element={<InicioAdmin />} />
        <Route path="gestionDoctor" element={<AgregarDoctor />} />
        <Route path="gestionEspecialidad" element={<AgregarEspecialidad />} />
        <Route path="gestionPaciente" element={<AgregarPaciente />} />
        <Route path="gestionSede" element={<CrudSede />} />
        <Route path="gestionHorario" element={<CrudHorario />} />
        <Route path="gestionDisponibilidad" element={<CrudDisponibilidad />} />
        <Route path="gestionCitas" element={<CrudCita />} />
        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Ruta para errores */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default AppRoutes;
