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
} from "../../../api/services/especialidadService";
import Alerta from "../../../Components/Alerta";

const cabeceras = [
  { id: "especialidad", label: "Nombre de la Especialidad" },
  { id: "descripcion", label: "Descripción" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
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
  const [alerta, setAlerta] = useState({ open: false });

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

  const cerrarAlerta = () => {
    setAlerta({ open: false });
  };

  const editarEspecialidad = (especialidad) => {
    setEspecialidadEditando(especialidad);
    setModalAbierto(true);
  };

  const guardarEspecialidad = async (especialidad) => {
    try {
      setGuardando(true);

      if (especialidad.id) {
        const especialidadActualizada = await actualizarEspecialidad(
          especialidad.id,
          especialidad
        );
        setEspecialidades((prev) =>
          prev.map((e) =>
            e.id === especialidad.id ? especialidadActualizada : e
          )
        );

        setAlerta({
          open: true,
          titulo: "Especialidad Actualizada",
          mensaje: `La especialidad "${especialidad.especialidad}" fue actualizada correctamente.`,
          tipo: "success",
        });
      } else {
        const nuevaEspecialidad = await crearEspecialidad(especialidad);
        setEspecialidades((prev) => [...prev, nuevaEspecialidad]);

        setAlerta({
          open: true,
          titulo: "Especialidad Creada",
          mensaje: `La especialidad "${especialidad.especialidad}" fue registrada exitosamente.`,
          tipo: "success",
        });
      }

      cerrarModal();
    } catch (error) {
      setAlerta({
        open: true,
        titulo: "Error",
        mensaje: "No se pudo guardar la especialidad. " + error.message,
        tipo: "error",
      });
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
    setFilasPerPagina(parseInt(evento.target.value, 10));
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

          <Alerta
            open={alerta.open}
            onClose={cerrarAlerta}
            titulo={alerta.titulo}
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
            posicion={alerta.posicion}
            timer={alerta.timer}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudEspecialidad;
