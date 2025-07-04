import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaDoctores from "./Componentes/Tabla";
import ModalFormulario from "./Componentes/Modal";
import {
  obtenerDoctores,
  crearDoctorConUsuario,
  actualizarDoctor,
  eliminarDoctor,
} from "../../../api/services/doctorServices";
import { obtenerEspecialidades } from "../../../api/services/especialidadService";

// ✅ CORREGIDO: Removí "correo" de las cabeceras para evitar duplicación
const cabeceras = [
  { id: "nombres", label: "Nombre" },
  { id: "apellidos", label: "Apellido" },
  { id: "dni", label: "DNI" },
  { id: "cmp", label: "CMP" },
  { id: "celular", label: "Celular" },
  { id: "especialidad", label: "Especialidad" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function CrudDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [doctorEditando, setDoctorEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const [docs, especialidadesAPI] = await Promise.all([
        obtenerDoctores(),
        obtenerEspecialidades(),
      ]);
      setDoctores(docs);
      setEspecialidades(especialidadesAPI);
    } catch (err) {
      setError(err.message || "Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setDoctorEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDoctorEditando(null);
  };

  const editarDoctor = (doctor) => {
    setDoctorEditando(doctor);
    setModalAbierto(true);
  };

  const guardarDoctor = async (doctor) => {
    try {
      setGuardando(true);
      setError(null);

      if (doctor.id) {
        // Actualizar sin usuario
        const actualizado = await actualizarDoctor(doctor.id, doctor);
        setDoctores(
          doctores.map((d) => (d.id === doctor.id ? actualizado : d))
        );
      } else {
        // Crear SIEMPRE con usuario
        const nuevo = await crearDoctorConUsuario(doctor);
        setDoctores([...doctores, nuevo]);
      }
      cerrarModal();
    } catch (error) {
      setError(
        "Error al guardar doctor: " + (error.message || "Error desconocido.")
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarDoctorLocal = async (id) => {
    try {
      await eliminarDoctor(id);
      setDoctores(doctores.filter((d) => d.id !== id));
    } catch (error) {
      setError(
        "Error al eliminar doctor: " + (error.message || "Error desconocido.")
      );
    }
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(0);
  };

  const manejarCambioPagina = (e, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilas = (e) => {
    setFilasPerPagina(Number.parseInt(e.target.value, 10));
    setPagina(0);
  };

  const doctoresFiltrados = doctores.filter((d) => {
    const t = busqueda.toLowerCase();
    return (
      d.nombres.toLowerCase().includes(t) ||
      d.apellidos.toLowerCase().includes(t) ||
      d.dni.toLowerCase().includes(t) ||
      d.cmp.toLowerCase().includes(t) ||
      d.usuario?.correo?.toLowerCase().includes(t) ||
      d.celular.toLowerCase().includes(t) ||
      d.estado.toLowerCase().includes(t) ||
      d.especialidad?.nombre?.toLowerCase().includes(t)
    );
  });

  if (cargando) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Gestión de Doctores
          </Typography>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}
          <TablaDoctores
            cabeceras={cabeceras}
            doctores={doctoresFiltrados}
            onEditar={editarDoctor}
            onEliminar={eliminarDoctorLocal}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilas}
          />
          <ModalFormulario
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarDoctor}
            registro={doctorEditando}
            cabeceras={cabeceras}
            especialidades={especialidades}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudDoctores;
