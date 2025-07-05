import { useState } from "react"
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import SaveIcon from "@mui/icons-material/Save"
import { convertirA24Horas } from "../index"

const FormularioContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}))

// Generar horas del día en formato 12 horas
const generarHoras = () => {
  const horas = []
  for (let h = 1; h <= 12; h++) {
    for (let m = 0; m < 60; m += 30) {
      const minutos = m.toString().padStart(2, "0")
      horas.push(`${h}:${minutos} AM`)
      if (h !== 12) horas.push(`${h}:${minutos} PM`)
    }
  }
  horas.push("12:00 PM", "12:30 PM")
  return horas.sort((a, b) => {
    const timeA = convertirA24Horas(a)
    const timeB = convertirA24Horas(b)
    return timeA - timeB
  })
}

export default function FormularioHorario({ onGuardar, diasSemana }) {
  const [formulario, setFormulario] = useState({
    dia: "",
    horaInicio: "",
    horaFin: "",
  })
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const horas = generarHoras()

  const manejarCambio = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor })
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: "" })
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formulario.dia) nuevosErrores.dia = "Selecciona un día"
    if (!formulario.horaInicio) nuevosErrores.horaInicio = "Selecciona hora de inicio"
    if (!formulario.horaFin) nuevosErrores.horaFin = "Selecciona hora de fin"

    if (formulario.horaInicio && formulario.horaFin) {
      const inicioMinutos = convertirA24Horas(formulario.horaInicio)
      const finMinutos = convertirA24Horas(formulario.horaFin)

      if (inicioMinutos >= finMinutos) {
        nuevosErrores.horaFin = "La hora de fin debe ser posterior a la de inicio"
      }

      // Validación: no permitir horas iguales
      if (inicioMinutos === finMinutos) {
        nuevosErrores.horaFin = "La hora de inicio y fin no pueden ser iguales"
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarGuardar = async () => {
    if (!validarFormulario()) return

    try {
      setGuardando(true)
      const exito = await onGuardar(formulario)
      if (exito !== false) {
        // Solo limpiar si se guardó exitosamente
        setFormulario({ dia: "", horaInicio: "", horaFin: "" })
        setErrores({})
      }
    } catch (error) {
      console.error("Error en formulario:", error)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <FormularioContainer>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AccessTimeIcon />
        Agregar Nuevo Horario
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}>
        <FormControl sx={{ minWidth: 150 }} error={!!errores.dia}>
          <InputLabel>Día de la Semana</InputLabel>
          <Select
            value={formulario.dia}
            onChange={(e) => manejarCambio("dia", e.target.value)}
            label="Día de la Semana"
            disabled={guardando}
          >
            {diasSemana.map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </Select>
          {errores.dia && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errores.dia}
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} error={!!errores.horaInicio}>
          <InputLabel>Hora Inicio</InputLabel>
          <Select
            value={formulario.horaInicio}
            onChange={(e) => manejarCambio("horaInicio", e.target.value)}
            label="Hora Inicio"
            disabled={guardando}
          >
            {horas.map((hora) => (
              <MenuItem key={hora} value={hora}>
                {hora}
              </MenuItem>
            ))}
          </Select>
          {errores.horaInicio && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errores.horaInicio}
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} error={!!errores.horaFin}>
          <InputLabel>Hora Fin</InputLabel>
          <Select
            value={formulario.horaFin}
            onChange={(e) => manejarCambio("horaFin", e.target.value)}
            label="Hora Fin"
            disabled={guardando}
          >
            {horas.map((hora) => (
              <MenuItem key={hora} value={hora}>
                {hora}
              </MenuItem>
            ))}
          </Select>
          {errores.horaFin && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errores.horaFin}
            </Typography>
          )}
        </FormControl>

        <Button
          variant="contained"
          onClick={manejarGuardar}
          startIcon={<SaveIcon />}
          sx={{ height: "56px", px: 3 }}
          size="large"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar Horario"}
        </Button>
      </Box>
    </FormularioContainer>
  )
}
