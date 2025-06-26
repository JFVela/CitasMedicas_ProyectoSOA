import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablaSedes from "./Componentes/Tabla";
import ModalFormularioSede from "./Componentes/Modal";
import { obtenerSedes, crearSede, actualizarSede } from "./data"; // ahora se usa la API real

// Cabeceras para la tabla de Sedes
const cabecerasSede = [
  { id: "nombre", label: "Nombre" },
  { id: "direccion", label: "Dirección" },
  { id: "distrito", label: "Distrito" },
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

function CrudSede() {
  const [sedes, setSedes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sedeEditando, setSedeEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarSedes();
  }, []);

  const cargarSedes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerSedes();
      setSedes(data);
    } catch (error) {
      setError(error.message || "Error al cargar las sedes.");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setSedeEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSedeEditando(null);
  };

  const editarSede = (sede) => {
    setSedeEditando(sede);
    setModalAbierto(true);
  };

  const guardarSede = async (sede) => {
    try {
      setGuardando(true);
      setError(null);

      if (sede.id) {
        const sedeActualizada = await actualizarSede(sede.id, sede);
        setSedes(sedes.map((e) => (e.id === sede.id ? sedeActualizada : e)));
      } else {
        const nuevaSede = await crearSede(sede);
        setSedes([...sedes, nuevaSede]);
      }

      cerrarModal();
    } catch (error) {
      setError("Error al guardar la sede: " + error.message);
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

  const sedesFiltradas = sedes.filter((e) => {
    const termino = busqueda.toLowerCase();
    return (
      e.nombre.toLowerCase().includes(termino) ||
      e.direccion.toLowerCase().includes(termino) ||
      e.distrito.toLowerCase().includes(termino) ||
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
            Gestión de Sedes
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

          <TablaSedes
            cabeceras={cabecerasSede}
            sedes={sedesFiltradas}
            onEditar={editarSede}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarCambioFilasPorPagina}
          />

          <ModalFormularioSede
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarSede}
            sede={sedeEditando}
            cabeceras={cabecerasSede}
            guardando={guardando}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudSede;
