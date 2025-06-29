import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaDisponibilidad from "./Componentes/Tabla";
import ModalDisponibilidad from "./Componentes/Modal";
import {
  obtenerDisponibilidades,
  crearDisponibilidad,
  editarDisponibilidad,
  eliminarDisponibilidad,
} from "./data";
import { obtenerDoctores } from "./dataDoctor";
import { obtenerSedes } from "./dataSede";
import { obtenerHorarios } from "./dataHorario";

const cabeceras = [
  { id: "doctor", label: "Doctor" },
  { id: "sede", label: "Sede" },
  { id: "horario", label: "Horario" },
  { id: "fechaInicio", label: "Fecha Inicio" },
  { id: "fechaFin", label: "Fecha Fin" },
  { id: "estado", label: "Estado" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function CrudDisponibilidad() {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0);
  const [filasPerPagina, setFilasPerPagina] = useState(10);
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
      const [disponibilidadAPI, doctorAPI, sedeAPI, horarioAPI] =
        await Promise.all([
          obtenerDisponibilidades(),
          obtenerDoctores(),
          obtenerSedes(),
          obtenerHorarios(),
        ]);
      setDisponibilidades(disponibilidadAPI);
      setDoctores(doctorAPI);
      setSedes(sedeAPI);
      setHorarios(horarioAPI);
    } catch (err) {
      setError(err.message || "Error al cargar datos.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setRegistroEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRegistroEditando(null);
  };

  const editarRegistro = (registro) => {
    setRegistroEditando(registro);
    setModalAbierto(true);
  };

  const guardarRegistro = async (registro) => {
    try {
      setGuardando(true);
      if (!registro.id) {
        const nuevo = await crearDisponibilidad(registro);
        setDisponibilidades([...disponibilidades, nuevo]);
      } else {
        const actualizado = await editarDisponibilidad(registro.id, registro);
        setDisponibilidades(
          disponibilidades.map((d) => (d.id === registro.id ? actualizado : d))
        );
      }
      cerrarModal();
    } catch (error) {
      setError("Error al guardar disponibilidad: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarRegistro = async (id) => {
    try {
      await eliminarDisponibilidad(id);
      setDisponibilidades(disponibilidades.filter((d) => d.id !== id));
    } catch (error) {
      setError("Error al eliminar disponibilidad: " + error.message);
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

  const filtradas = disponibilidades.filter((d) => {
    const texto = busqueda.toLowerCase();
    return (
      d.doctor.nombre.toLowerCase().includes(texto) ||
      d.sede.nombre.toLowerCase().includes(texto) ||
      d.horario.nombre.toLowerCase().includes(texto) ||
      d.estado.toLowerCase().includes(texto)
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
            Gestión de Disponibilidad
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
          <TablaDisponibilidad
            cabeceras={cabeceras}
            registros={filtradas}
            onEditar={editarRegistro}
            onEliminar={eliminarRegistro}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilas}
          />
          <ModalDisponibilidad
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarRegistro}
            registro={registroEditando}
            cabeceras={cabeceras}
            doctores={doctores}
            sedes={sedes}
            horarios={horarios}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudDisponibilidad;
