import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablaSedes from "./Componentes/Tabla";
import ModalFormularioSede from "./Componentes/Modal";
import { sedesIniciales } from "./data";

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
  const [sedes, setSedes] = useState(sedesIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sedeEditando, setSedeEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);

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

  const guardarSede = (sede) => {
    if (sede.id) {
      setSedes(
        sedes.map((e) => (e.id === sede.id ? sede : e))
      );
    } else {
      const nuevaSede = {
        ...sede,
        id: Date.now().toString(),
      };
      setSedes([...sedes, nuevaSede]);
    }
    cerrarModal();
  };

  const eliminarSede = (id) => {
    setSedes(sedes.filter((e) => e.id !== id));
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gestión de Sedes
          </Typography>

          <TablaSedes
            cabeceras={cabecerasSede}
            sedes={sedesFiltradas}
            onEditar={editarSede}
            onEliminar={eliminarSede}
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
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudSede;
