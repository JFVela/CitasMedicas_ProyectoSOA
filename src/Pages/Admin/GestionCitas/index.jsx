import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaCitas from "./Componentes/Tabla";
import ModalCita from "./Componentes/Modal";
import { obtenerCitas, actualizarCita } from "./data";

// Cabeceras para la tabla de Citas
const cabeceras = [
  { id: "paciente", label: "Paciente" },
  { id: "doctor", label: "Doctor" },
  { id: "especialidad", label: "Especialidad" },
  { id: "sede", label: "Sede" },
  { id: "fecha", label: "Registro" },
  { id: "horario", label: "Horario" },
  { id: "motivo", label: "Motivo" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function CrudCitas() {
  const [citas, setCitas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerCitas();
      setCitas(data);
    } catch (error) {
      setError(error.message || "Error al cargar citas médicas.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (cita) => {
    setCitaEditando(cita);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCitaEditando(null);
  };

  const guardarCita = async (datosEditados) => {
    try {
      setGuardando(true);
      const citaActualizada = await actualizarCita(
        citaEditando.id,
        datosEditados
      );
      setCitas(
        citas.map((c) => (c.id === citaEditando.id ? citaActualizada : c))
      );
      cerrarModal();
    } catch (error) {
      setError("Error al actualizar la cita: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarBusqueda = (evento) => {
    setBusqueda(evento.target.value);
    setPagina(0);
  };

  const manejarCambioPagina = (evento, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilasPorPagina = (evento) => {
    setFilasPerPagina(Number.parseInt(evento.target.value, 10));
    setPagina(0);
  };

  const citasFiltradas = citas.filter((c) => {
    const termino = busqueda.toLowerCase();
    return (
      c.paciente.toLowerCase().includes(termino) ||
      c.doctor.toLowerCase().includes(termino) ||
      c.especialidad.toLowerCase().includes(termino) ||
      c.sede.toLowerCase().includes(termino) ||
      c.estado.toLowerCase().includes(termino) ||
      c.fecha.toLowerCase().includes(termino)
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
            Gestión de Citas Médicas - Administrador
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          <TablaCitas
            cabeceras={cabeceras}
            citas={citasFiltradas}
            onEditar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />
          <ModalCita
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarCita}
            cita={citaEditando}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudCitas;
