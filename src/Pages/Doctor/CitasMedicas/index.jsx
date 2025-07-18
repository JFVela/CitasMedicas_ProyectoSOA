import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaCitas from "./Componentes/Tabla";
import { obtenerPacientesConCitasDelDoctor } from "../../../api/services/doctorServices";
import { registrarHistorialDesdeCita } from "../../../api/services/historialServices";
import ModalHistorial from "./Componentes/Modal";

// ✅ Cabeceras actualizadas - agregar columna ID
const cabeceras = [
  { id: "idCita", label: "ID Cita" }, // ✅ Nueva columna para mostrar ID real
  { id: "nombres", label: "Nombres" },
  { id: "apellidos", label: "Apellidos" },
  { id: "dni", label: "DNI" },
  { id: "celular", label: "Celular" },
  { id: "fechaCita", label: "Fecha y Hora de Cita" },
  { id: "motivoConsulta", label: "Motivo de Consulta" },
  { id: "estadoCita", label: "Estado de Cita" },
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

function ListaCitasDoctor() {
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [guardandoHistorial, setGuardandoHistorial] = useState(false);

  // ✅ ID del doctor fijo para pruebas
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const doctorId = usuario?.idUsuario;

  useEffect(() => {
    cargarCitasDelDoctor();
  }, []);

  // ✅ Función para cargar citas del doctor específico
  const cargarCitasDelDoctor = async () => {
    try {
      setCargando(true);
      setError(null);

      // Llamada a la función que obtiene citas del doctor
      const citasData = await obtenerPacientesConCitasDelDoctor(doctorId);
      console.log("Citas del doctor:", citasData);

      // Mapear los datos para que coincidan con el formato esperado
      const citasMapeadas = citasData.map((cita, index) => ({
        id: cita.idCita || cita.id || `temp-${index}`, // ✅ Usar ID real de la cita
        idCita: cita.idCita || cita.id, // ✅ ID real de la cita para el historial
        idPaciente: cita.idPaciente,
        nombres: cita.nombres,
        apellidos: cita.apellidos,
        dni: cita.dni,
        celular: cita.celular,
        fechaCita: cita.fechaCita,
        motivoConsulta: cita.motivoConsulta,
        estadoCita: cita.estadoCita,
      }));

      setCitas(citasMapeadas);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
      setError(error.message || "Error al cargar las citas del doctor.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModalHistorial = (cita) => {
    setCitaSeleccionada(cita);
    setModalHistorialAbierto(true);
  };

  const cerrarModalHistorial = () => {
    setModalHistorialAbierto(false);
    setCitaSeleccionada(null);
  };

  const guardarHistorial = async (datosHistorial) => {
    try {
      setGuardandoHistorial(true);
      setError(null);

      const dto = {
        idCita: citaSeleccionada.idCita, // ✅ Usar directamente el ID real de la cita
        diagnostico: datosHistorial.diagnostico,
        tratamiento: datosHistorial.tratamiento,
        receta: datosHistorial.receta,
      };

      console.log("DTO a enviar:", dto); // ✅ Para debugging
      const historialCreado = await registrarHistorialDesdeCita(dto);
      console.log("Historial creado:", historialCreado);

      setError(null);
      cerrarModalHistorial();
    } catch (error) {
      console.error("Error al crear historial:", error);
      setError(
        "Error al crear el historial médico: " +
          (error.message || "Error desconocido.")
      );
    } finally {
      setGuardandoHistorial(false);
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
    setFilasPerPagina(Number.parseInt(e.target.value, 10));
    setPagina(0);
  };

  // ✅ Filtrado mejorado para los campos de citas
  const citasFiltradas = citas.filter((c) => {
    const termino = busqueda.toLowerCase();
    return (
      c.nombres.toLowerCase().includes(termino) ||
      c.apellidos.toLowerCase().includes(termino) ||
      c.dni.toLowerCase().includes(termino) ||
      c.celular.toLowerCase().includes(termino) ||
      c.motivoConsulta.toLowerCase().includes(termino)
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
          {/* ✅ Título específico para citas */}
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Citas Médicas del Doctor
          </Typography>

          {/* ✅ Subtítulo con información del doctor y estadísticas */}
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            align="center"
            color="text.secondary"
          >
            Doctor ID: {doctorId} | Total de citas: {citas.length}
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

          {/* ✅ Tabla de citas sin funciones de edición */}
          <TablaCitas
            cabeceras={cabeceras}
            citas={citasFiltradas}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
            onCrearHistorial={abrirModalHistorial}
          />
        </Box>
        <ModalHistorial
          abierto={modalHistorialAbierto}
          onCerrar={cerrarModalHistorial}
          onGuardar={guardarHistorial}
          cita={citaSeleccionada}
          guardando={guardandoHistorial}
        />
      </Container>
    </ThemeProvider>
  );
}

export default ListaCitasDoctor;
