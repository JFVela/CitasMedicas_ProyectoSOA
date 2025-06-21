"use client"

// index.jsx
import { useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TablaDoctores from "./Componentes/Tabla"
import ModalFormulario from "./Componentes/Modal"
import { doctoresIniciales, especialidades } from "./data"

const cabeceras = [
  { id: "nombre", label: "Nombre" },
  { id: "apellido", label: "Apellido" },
  { id: "dni", label: "DNI" },
  { id: "cmp", label: "CMP" },
  { id: "correo", label: "Correo Electrónico" },
  { id: "celular", label: "Celular" },
  { id: "especialidad", label: "Especialidad" },
  { id: "estado", label: "Estado" },
]

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
})

function CrudDoctores() {
  const [doctores, setDoctores] = useState(doctoresIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [doctorEditando, setDoctorEditando] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [filasPerPagina, setFilasPorPagina] = useState(10)
  const [pagina, setPagina] = useState(0)

  const abrirModal = () => {
    setDoctorEditando(null)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setDoctorEditando(null)
  }

  const editarDoctor = (doctor) => {
    setDoctorEditando(doctor)
    setModalAbierto(true)
  }

  const guardarDoctor = (doctor) => {
    if (doctor.id) {
      // Editando - mantener la especialidad original
      const doctorActualizado = {
        ...doctor,
        idEspecialidad: doctorEditando.idEspecialidad,
        especialidad: doctorEditando.especialidad,
      }
      setDoctores(doctores.map((d) => (d.id === doctor.id ? doctorActualizado : d)))
    } else {
      // Agregando nuevo doctor
      const especialidadSeleccionada = especialidades.find((esp) => esp.id === doctor.idEspecialidad)
      const nuevo = {
        ...doctor,
        id: Date.now().toString(),
        especialidad: especialidadSeleccionada?.nombre || "",
      }
      setDoctores([...doctores, nuevo])
    }
    cerrarModal()
  }

  const eliminarDoctor = (id) => {
    setDoctores(doctores.filter((d) => d.id !== id))
  }

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value)
    setPagina(0)
  }

  const manejarCambioPagina = (e, nuevaPagina) => {
    setPagina(nuevaPagina)
  }

  const manejarFilasPorPagina = (e) => {
    setFilasPorPagina(Number.parseInt(e.target.value, 10))
    setPagina(0)
  }

  const doctoresFiltrados = doctores.filter((d) => {
    const t = busqueda.toLowerCase()
    return (
      d.nombre.toLowerCase().includes(t) ||
      d.apellido.toLowerCase().includes(t) ||
      d.especialidad.toLowerCase().includes(t)
    )
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Gestión de Doctores
          </Typography>
          <TablaDoctores
            cabeceras={cabeceras}
            doctores={doctoresFiltrados}
            onEditar={editarDoctor}
            onEliminar={eliminarDoctor}
            onAgregar={abrirModal}
            busqueda={busqueda}
            onBusquedaCambio={manejarBusqueda}
            pagina={pagina}
            filasPerPagina={filasPerPagina}
            onCambioPagina={manejarCambioPagina}
            onCambioFilasPorPagina={manejarFilasPorPagina}
          />
          <ModalFormulario
            abierto={modalAbierto}
            onCerrar={cerrarModal}
            onGuardar={guardarDoctor}
            registro={doctorEditando} // ✅ Corregido: era "especialidad"
            cabeceras={cabeceras}
            especialidades={especialidades} // ✅ Agregado
          />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default CrudDoctores
