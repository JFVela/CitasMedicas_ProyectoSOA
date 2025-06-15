"use client"

import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"

const ModalEspecialidad = ({ abierto, onCerrar, onGuardar, especialidad, cabeceras }) => {
  const [formulario, setFormulario] = useState({})
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (especialidad) {
      setFormulario({ ...especialidad })
    } else {
      const nuevoFormulario = {}
      cabeceras.forEach((cabecera) => {
        nuevoFormulario[cabecera.id] = ""
      })
      setFormulario(nuevoFormulario)
    }
    setErrores({})
  }, [especialidad, cabeceras, abierto])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario({
      ...formulario,
      [name]: value,
    })

    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      })
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}
    let esValido = true

    cabeceras.forEach((cabecera) => {
      if (!formulario[cabecera.id] || formulario[cabecera.id].trim() === "") {
        nuevosErrores[cabecera.id] = `El campo ${cabecera.label} es requerido`
        esValido = false
      }
    })

    setErrores(nuevosErrores)
    return esValido
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (validarFormulario()) {
      onGuardar(formulario)
    }
  }

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="sm" disableEnforceFocus>
      <DialogTitle>{especialidad && especialidad.id ? "Actualizar Especialidad" : "Agregar Especialidad"}</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent>
          <Grid container spacing={2}>
            {cabeceras.map((cabecera) => (
              <Grid item xs={12} key={cabecera.id}>
                {cabecera.id === "estado" ? (
                  <TextField
                    select
                    fullWidth
                    label={cabecera.label}
                    name={cabecera.id}
                    value={formulario[cabecera.id] || ""}
                    onChange={manejarCambio}
                    error={!!errores[cabecera.id]}
                    helperText={errores[cabecera.id] || ""}
                    margin="normal"
                    variant="outlined"
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    label={cabecera.label}
                    name={cabecera.id}
                    value={formulario[cabecera.id] || ""}
                    onChange={manejarCambio}
                    error={!!errores[cabecera.id]}
                    helperText={errores[cabecera.id] || ""}
                    margin="normal"
                    variant="outlined"
                    multiline={cabecera.id === "descripcion"}
                    rows={cabecera.id === "descripcion" ? 4 : 1}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCerrar} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {especialidad && especialidad.id ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalEspecialidad
