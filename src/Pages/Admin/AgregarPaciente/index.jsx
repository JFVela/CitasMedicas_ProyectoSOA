import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import TablaPacientes from "./Componentes/Tabla";
import ModalFormularioPaciente from "./Componentes/Modal";
import Alerta from "../../../Components/Alerta";

import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  // eliminarPaciente,
} from "../../../api/services/pacienteServices";

const cabeceras = [
  { id: "nombres", label: "Nombres" },
  { id: "apellidos", label: "Apellidos" },
  { id: "dni", label: "DNI" },
  { id: "correo", label: "Correo" },
  { id: "celular", label: "Celular" },
  { id: "sexo", label: "Sexo" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function CrudPaciente() {
  const [pacientes, setPacientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ open: false });

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerPacientes();
      setPacientes(data);
    } catch (error) {
      setError(error.message || "Error al cargar pacientes.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setPacienteEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteEditando(null);
  };

  const cerrarAlerta = () => {
    setAlerta({ open: false });
  };

  const editarPaciente = (paciente) => {
    setPacienteEditando(paciente);
    setModalAbierto(true);
  };

  const guardarPaciente = async (paciente) => {
    try {
      setGuardando(true);
      setError(null);

      if (paciente.id) {
        const actualizado = await actualizarPaciente(paciente.id, paciente);
        setPacientes((prev) =>
          prev.map((p) => (p.id === paciente.id ? actualizado : p))
        );

        setAlerta({
          open: true,
          titulo: "Paciente Actualizado",
          mensaje: `El paciente "${paciente.nombres} ${paciente.apellidos}" fue actualizado correctamente.`,
          tipo: "success",
        });
      } else {
        const nuevo = await crearPaciente(paciente);
        setPacientes((prev) => [...prev, nuevo]);

        setAlerta({
          open: true,
          titulo: "Paciente Registrado",
          mensaje: `El paciente "${paciente.nombres} ${paciente.apellidos}" fue registrado exitosamente.`,
          tipo: "success",
        });
      }

      cerrarModal();
    } catch (error) {
      setAlerta({
        open: true,
        titulo: "Error",
        mensaje: "No se pudo guardar el paciente. " + error.message,
        tipo: "error",
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
    setPagina(0);
  };

  const manejarCambioPagina = (e, nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const manejarCambioFilasPorPagina = (e) => {
    setFilasPerPagina(parseInt(e.target.value, 10));
    setPagina(0);
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombres.toLowerCase().includes(termino) ||
      p.apellidos.toLowerCase().includes(termino) ||
      p.dni.toLowerCase().includes(termino) ||
      p.estado.toLowerCase().includes(termino)
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
            Gestión de Pacientes
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

          <TablaPacientes
            cabeceras={cabeceras}
            pacientes={pacientesFiltrados}
            onEditar={editarPaciente}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />

          <ModalFormularioPaciente
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarPaciente}
            paciente={pacienteEditando}
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

export default CrudPaciente;
