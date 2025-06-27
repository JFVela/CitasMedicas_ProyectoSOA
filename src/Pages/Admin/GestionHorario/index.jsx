import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaHorarios from "./Componentes/Tabla";
import ModalFormularioHorario from "./Componentes/Modal";
import { obtenerHorarios, crearHorario, actualizarHorario } from "./data";

// Cabeceras para la tabla de Horarios
const cabecerasHorario = [
  { id: "diaSemana", label: "Día Semana" },
  { id: "horaInicio", label: "Hora Inicio" },
  { id: "horaFin", label: "Hora Fin" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function CrudHorario() {
  const [horarios, setHorarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horarioEditando, setHorarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Cargar horarios al iniciar
  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerHorarios();
      setHorarios(data);
    } catch (error) {
      setError(error.message || "Error desconocido al cargar horarios.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setHorarioEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setHorarioEditando(null);
  };

  const editarHorario = (horario) => {
    setHorarioEditando(horario);
    setModalAbierto(true);
  };

  const guardarHorario = async (horario) => {
    try {
      setGuardando(true);
      setError(null);

      if (horario.id) {
        const horarioActualizado = await actualizarHorario(horario.id, horario);
        setHorarios(
          horarios.map((h) => (h.id === horario.id ? horarioActualizado : h))
        );
      } else {
        const nuevoHorario = await crearHorario(horario);
        setHorarios([...horarios, nuevoHorario]);
      }

      cerrarModal();
    } catch (error) {
      setError("Error al guardar el horario: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(0);
  };

  const manejarCambioPagina = (evento, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilasPorPagina = (evento) => {
    setFilasPerPagina(Number.parseInt(evento.target.value, 10));
    setPagina(0);
  };

  const normalizarTexto = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const horariosFiltrados = horarios.filter((h) => {
    const termino = normalizarTexto(busqueda);
    return (
      normalizarTexto(h.diaSemana).includes(termino) ||
      normalizarTexto(h.horaInicio).includes(termino) ||
      normalizarTexto(h.horaFin).includes(termino) ||
      normalizarTexto(h.estado).includes(termino)
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
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gestión de Horarios
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

          <TablaHorarios
            cabeceras={cabecerasHorario}
            horarios={horariosFiltrados}
            onEditar={editarHorario}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />

          <ModalFormularioHorario
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarHorario}
            horario={horarioEditando}
            cabeceras={cabecerasHorario}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudHorario;
