import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablaEspecialidades from "./Componentes/Tabla";
import ModalFormulario from "./Componentes/Modal";
import { especialidadInicial } from "./data";

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
  const [especialidades, setEspecialidades] = useState(especialidadInicial);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);

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

  const guardarEspecialidad = (especialidad) => {
    if (especialidad.id) {
      setEspecialidades(
        especialidades.map((e) => (e.id === especialidad.id ? especialidad : e))
      );
    } else {
      const nuevaEspecialidad = {
        ...especialidad,
        id: Date.now().toString(),
      };
      setEspecialidades([...especialidades, nuevaEspecialidad]);
    }
    cerrarModal();
  };

  const eliminarEspecialidad = (id) => {
    setEspecialidades(especialidades.filter((e) => e.id !== id));
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

  const especialidadesFiltradas = especialidades.filter((e) => {
    const termino = busqueda.toLowerCase();
    return (
      e.especialidad.toLowerCase().includes(termino) ||
      e.descripcion.toLowerCase().includes(termino) ||
      e.estado.toLowerCase().includes(termino)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gestión de Especialidades
          </Typography>

          <TablaEspecialidades
            cabeceras={cabeceras}
            especialidades={especialidadesFiltradas} // Puedes renombrar si modificas el componente
            onEditar={editarEspecialidad}
            onEliminar={eliminarEspecialidad}
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
            especialidad={especialidadEditando} // Puedes renombrar por "registro"
            cabeceras={cabeceras}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudEspecialidad;
