import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaEspecialidades from "./Componentes/Tabla";
import ModalFormulario from "./Componentes/Modal";
import {
  obtenerEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  // eliminarEspecialidad, // Eliminado
} from "../../../api/services/especialidadService";

// Cabeceras para la tabla de Especialidades
const cabeceras = [
  { id: "especialidad", label: "Nombre de la Especialidad" },
  { id: "descripcion", label: "Descripción" },
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

function CrudEspecialidad() {
  const [especialidades, setEspecialidades] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerEspecialidades();
      setEspecialidades(data);
    } catch (error) {
      setError(error.message || "Error desconocido al cargar especialidades.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setEspecialidadEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEspecialidadEditando(null);
  };

  const editarEspecialidad = (especialidad) => {
    setEspecialidadEditando(especialidad);
    setModalAbierto(true);
  };

  const guardarEspecialidad = async (especialidad) => {
    try {
      setGuardando(true);
      setError(null);

      if (especialidad.id) {
        // Actualizar especialidad existente
        const especialidadActualizada = await actualizarEspecialidad(
          especialidad.id,
          especialidad
        );
        setEspecialidades(
          especialidades.map((e) =>
            e.id === especialidad.id ? especialidadActualizada : e
          )
        );
      } else {
        // Crear nueva especialidad
        const nuevaEspecialidad = await crearEspecialidad(especialidad);
        setEspecialidades([...especialidades, nuevaEspecialidad]);
      }

      cerrarModal();
    } catch (error) {
      setError("Error al guardar la especialidad: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar función y lógica de eliminar
  // const manejarEliminarEspecialidad = async (id) => {
  //   try {
  //     setError(null);
  //     await eliminarEspecialidad(id);
  //     setEspecialidades(especialidades.filter((e) => e.id !== id));
  //   } catch (error) {
  //     setError("Error al eliminar la especialidad: " + error.message);
  //   }
  // };

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

  const especialidadesFiltradas = especialidades.filter((e) => {
    const termino = busqueda.toLowerCase();
    return (
      e.especialidad.toLowerCase().includes(termino) ||
      e.descripcion.toLowerCase().includes(termino) ||
      e.estado.toLowerCase().includes(termino)
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
            Gestión de Especialidades
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

          <TablaEspecialidades
            cabeceras={cabeceras}
            especialidades={especialidadesFiltradas}
            onEditar={editarEspecialidad}
            // onEliminar={manejarEliminarEspecialidad} // Eliminado
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />

          <ModalFormulario
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarEspecialidad}
            especialidad={especialidadEditando}
            cabeceras={cabeceras}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudEspecialidad;
