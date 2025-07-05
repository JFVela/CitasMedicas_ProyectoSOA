
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material"
import { convertirA24Horas } from "../index"

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

export default function ModalEdicion({ abierto, tarea, onCerrar, onGuardar }) {
  const [tareaEditando, setTareaEditando] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const horas = generarHoras()

  useEffect(() => {
    if (tarea) {
      setTareaEditando({ ...tarea })
    }
    setErrores({})
  }, [tarea])

  const validarFormulario = () => {
    if (!tareaEditando) return false

    const nuevosErrores = {}

    if (tareaEditando.horaInicio && tareaEditando.horaFin) {
      const inicioMinutos = convertirA24Horas(tareaEditando.horaInicio)
      const finMinutos = convertirA24Horas(tareaEditando.horaFin)

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
      const exito = await onGuardar(tareaEditando)
      if (exito !== false) {
        // Solo cerrar si se guardó exitosamente
        onCerrar()
      }
    } catch (error) {
      console.error("Error en modal:", error)
    } finally {
      setGuardando(false)
    }
  }

  if (!tareaEditando) return null

  return (
    <Dialog open={abierto} onClose={!guardando ? onCerrar : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Horario</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl fullWidth error={!!errores.horaInicio}>
              <InputLabel>Hora Inicio</InputLabel>
              <Select
                value={tareaEditando.horaInicio}
                onChange={(e) => setTareaEditando({ ...tareaEditando, horaInicio: e.target.value })}
                label="Hora Inicio"
                disabled={guardando}
              >
                {horas.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth error={!!errores.horaFin}>
              <InputLabel>Hora Fin</InputLabel>
              <Select
                value={tareaEditando.horaFin}
                onChange={(e) => setTareaEditando({ ...tareaEditando, horaFin: e.target.value })}
                label="Hora Fin"
                disabled={guardando}
              >
                {horas.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {errores.horaFin && <Box sx={{ color: "error.main", fontSize: "0.75rem", mb: 2 }}>{errores.horaFin}</Box>}

          <FormControlLabel
            control={
              <Switch
                checked={tareaEditando.activo}
                onChange={(e) => setTareaEditando({ ...tareaEditando, activo: e.target.checked })}
                color="primary"
                disabled={guardando}
              />
            }
            label={`Estado: ${tareaEditando.activo ? "Activo" : "Inactivo"}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCerrar} color="secondary" disabled={guardando}>
          Cancelar
        </Button>
        <Button
          onClick={manejarGuardar}
          variant="contained"
          color="primary"
          disabled={guardando}
          startIcon={guardando ? <CircularProgress size={20} /> : null}
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
