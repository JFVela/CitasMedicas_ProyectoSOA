import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaHistorial from "./Componentes/Tabla";
import ModalHistorial from "./Componentes/Modal";
import {
  obtenerHistoriales,
  actualizarHistorial,
  eliminarHistorial,
} from "./data";

const cabeceras = [
  { id: "paciente", label: "Paciente" },
  { id: "doctor", label: "Doctor" },
  { id: "especialidad", label: "Especialidad" },
  { id: "sede", label: "Sede" },
  { id: "fechaCita", label: "Fecha Cita" },
  { id: "fechaRegistro", label: "Fecha Registro" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "tratamiento", label: "Tratamiento" },
  { id: "receta", label: "Receta" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function CrudHistorialMedico() {
  const [historiales, setHistoriales] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [historialEditando, setHistorialEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarHistoriales();
  }, []);

  const cargarHistoriales = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerHistoriales();
      setHistoriales(data);
    } catch (err) {
      setError(err.message || "Error al cargar los historiales médicos.");
    } finally {
      setCargando(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setHistorialEditando(null);
  };

  const editarHistorial = (historial) => {
    setHistorialEditando(historial);
    setModalAbierto(true);
  };

  const guardarHistorial = async (historial) => {
    try {
      setGuardando(true);
      setError(null);
      const actualizado = await actualizarHistorial(historial.id, historial);
      setHistoriales(
        historiales.map((h) => (h.id === historial.id ? actualizado : h))
      );
      cerrarModal();
    } catch (error) {
      setError("Error al actualizar historial: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarHistorialLocal = async (id) => {
    try {
      await eliminarHistorial(id);
      setHistoriales(historiales.filter((h) => h.id !== id));
    } catch (error) {
      setError("Error al eliminar historial: " + error.message);
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

  const historialesFiltrados = historiales.filter((h) => {
    const t = busqueda.toLowerCase();
    return (
      h.paciente.toLowerCase().includes(t) ||
      h.doctor.toLowerCase().includes(t) ||
      h.especialidad.toLowerCase().includes(t) ||
      h.sede.toLowerCase().includes(t) ||
      h.diagnostico.toLowerCase().includes(t) ||
      h.tratamiento.toLowerCase().includes(t) ||
      h.receta.toLowerCase().includes(t)
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
            Historias Médicas del Doctor
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
          <TablaHistorial
            cabeceras={cabeceras}
            historiales={historialesFiltrados}
            onEditar={editarHistorial}
            onEliminar={eliminarHistorialLocal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilas}
          />
          <ModalHistorial
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarHistorial}
            registro={historialEditando}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudHistorialMedico;
