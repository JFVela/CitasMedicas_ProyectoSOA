import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablaPacientes from "../../../Components/TablaCrud";
import ModalFormulario from "../../../Components/ModalFormulario";
import { pacientesIniciales } from "./data";

// Definición de las cabeceras de la tabla
const cabeceras = [
  { id: "nombre", label: "Nombre" },
  { id: "apellido", label: "Apellido" },
  { id: "edad", label: "Edad" },
  { id: "genero", label: "Género" },
  { id: "telefono", label: "Teléfono" },
  { id: "email", label: "Email" },
  { id: "direccion", label: "Dirección" },
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

function crudPaciente() {
  const [pacientes, setPacientes] = useState(pacientesIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filasPerPagina, setFilasPerPagina] = useState(10);
  const [pagina, setPagina] = useState(0);

  const abrirModal = () => {
    setPacienteEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteEditando(null);
  };

  const editarPaciente = (paciente) => {
    setPacienteEditando(paciente);
    setModalAbierto(true);
  };

  const guardarPaciente = (paciente) => {
    if (paciente.id) {
      // Actualizar paciente existente
      setPacientes(pacientes.map((p) => (p.id === paciente.id ? paciente : p)));
    } else {
      // Agregar nuevo paciente
      const nuevoPaciente = {
        ...paciente,
        id: Date.now().toString(),
      };
      setPacientes([...pacientes, nuevoPaciente]);
    }
    cerrarModal();
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter((paciente) => paciente.id !== id));
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

  // Filtrar pacientes según la búsqueda
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(terminoBusqueda) ||
      paciente.apellido.toLowerCase().includes(terminoBusqueda) ||
      paciente.email.toLowerCase().includes(terminoBusqueda)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gestión de Pacientes
          </Typography>

          <TablaPacientes
            cabeceras={cabeceras}
            pacientes={pacientesFiltrados}
            onEditar={editarPaciente}
            onEliminar={eliminarPaciente}
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
            onGuardar={guardarPaciente}
            paciente={pacienteEditando}
            cabeceras={cabeceras}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default crudPaciente;
