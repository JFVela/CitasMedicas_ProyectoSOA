import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablaHorarios from "./Componentes/Tabla";
import ModalFormularioHorario from "./Componentes/Modal";
import { horariosIniciales } from "./data";

// Cabeceras para la tabla de Horarios
const cabecerasHorario = [
  { id: "dia_semana", label: "Día Semana" },
  { id: "hora_inicio", label: "Hora Inicio" },
  { id: "hora_fin", label: "Hora Fin" },
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
  const [horarios, setHorarios] = useState(horariosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [horarioEditando, setHorarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cerrarModal = () => {
    setModalAbierto(false);
    setHorarioEditando(null);
  };

  const editarHorario = (horario) => {
    setHorarioEditando(horario);
    setModalAbierto(true);
  };

  const guardarHorario = (horario) => {
    if (horario.id) {
      setHorarios(horarios.map((e) => (e.id === horario.id ? horario : e)));
    } else {
      const nuevoHorario = {
        ...horario,
        id: Date.now().toString(),
      };
      setHorarios([...horarios, nuevoHorario]);
    }
    cerrarModal();
  };

  const manejarBusqueda = (evento) => {
    setBusqueda(evento.target.value);
    setPagina(0);
  };

  const normalizarTexto = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const horariosFiltrados = horarios.filter((e) => {
    const termino = normalizarTexto(busqueda);

    return (
      normalizarTexto(e.dia_semana).includes(termino) ||
      normalizarTexto(e.hora_inicio).includes(termino) ||
      normalizarTexto(e.hora_fin).includes(termino) ||
      normalizarTexto(e.estado).includes(termino)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gestión de Horarios
          </Typography>

          <TablaHorarios
            cabeceras={cabecerasHorario}
            horario={horariosFiltrados}
            onEditar={editarHorario}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
          />

          <ModalFormularioHorario
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarHorario}
            horario={horarioEditando}
            cabeceras={cabecerasHorario}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default CrudHorario;
