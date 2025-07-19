import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaPacientes from "./Componentes/Tabla";
import { obtenerPacientesDelDoctor } from "../../../api/services/doctorServices";

// ✅ Cabeceras actualizadas según la respuesta de tu API
const cabeceras = [
  { id: "nombres", label: "Nombres" },
  { id: "apellidos", label: "Apellidos" },
  { id: "dni", label: "DNI" },
  { id: "celular", label: "Celular" },
  { id: "fechaNacimiento", label: "Fecha de Nacimiento" },
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

function ListaPacientesDoctor() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ✅ ID del doctor fijo para pruebas
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const doctorId = 65;

  useEffect(() => {
    cargarPacientesDelDoctor();
  }, []);

  // ✅ Función para cargar pacientes del doctor específico
  const cargarPacientesDelDoctor = async () => {
    try {
      setCargando(true);
      setError(null);

      // Llamada a la función que obtiene pacientes del doctor
      const pacientesData = await obtenerPacientesDelDoctor(doctorId);
      console.log("Pacientes del doctor:", pacientesData);

      // Mapear los datos para que coincidan con el formato esperado
      const pacientesMapeados = pacientesData.map((paciente) => ({
        id: paciente.idPaciente,
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        dni: paciente.dni,
        celular: paciente.celular,
        fechaNacimiento: paciente.fechaNacimiento,
      }));

      setPacientes(pacientesMapeados);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      setError(error.message || "Error al cargar los pacientes del doctor.");
    } finally {
      setCargando(false);
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

  // ✅ Filtrado mejorado para los nuevos campos
  const pacientesFiltrados = pacientes.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombres.toLowerCase().includes(termino) ||
      p.apellidos.toLowerCase().includes(termino) ||
      p.dni.toLowerCase().includes(termino) ||
      p.celular.toLowerCase().includes(termino)
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
          {/* ✅ Título actualizado */}
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Lista de Pacientes del Doctor
          </Typography>

          {/* ✅ Subtítulo con información del doctor */}
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            align="center"
            color="text.secondary"
          >
            Doctor ID: {doctorId} | Total de pacientes: {pacientes.length}
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

          {/* ✅ Tabla sin funciones de edición/eliminación/agregado */}
          <TablaPacientes
            cabeceras={cabeceras}
            pacientes={pacientesFiltrados}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ListaPacientesDoctor;
