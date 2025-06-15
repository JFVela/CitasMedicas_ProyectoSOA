"use client"

import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"

const ModalFormulario = ({ abierto, onCerrar, onGuardar, paciente, cabeceras }) => {
  const [formulario, setFormulario] = useState({})
  const [errores, setErrores] = useState({})

  // Inicializar o actualizar el formulario cuando cambia el paciente
  useEffect(() => {
    if (paciente) {
      setFormulario({ ...paciente })
    } else {
      // Crear un objeto vacío con las propiedades de las cabeceras
      const nuevoFormulario = {}
      cabeceras.forEach((cabecera) => {
        nuevoFormulario[cabecera.id] = ""
      })
      setFormulario(nuevoFormulario)
    }
    setErrores({})
  }, [paciente, cabeceras, abierto])

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario({
      ...formulario,
      [name]: value,
    })

    // Limpiar error cuando el usuario escribe
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

    // Validar campos requeridos
    cabeceras.forEach((cabecera) => {
      if (!formulario[cabecera.id] || formulario[cabecera.id].trim() === "") {
        nuevosErrores[cabecera.id] = `El campo ${cabecera.label} es requerido`
        esValido = false
      }
    })

    // Validaciones específicas
    if (formulario.email && !/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = "Email inválido"
      esValido = false
    }

    if (formulario.edad && (isNaN(formulario.edad) || Number.parseInt(formulario.edad) <= 0)) {
      nuevosErrores.edad = "La edad debe ser un número positivo"
      esValido = false
    }

    if (formulario.telefono && !/^\d{9,10}$/.test(formulario.telefono)) {
      nuevosErrores.telefono = "Teléfono inválido (9-10 dígitos)"
      esValido = false
    }

    setErrores(nuevosErrores)
    return esValido
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    if (validarFormulario()) {
      onGuardar(formulario)
    }
  }

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="md">
      <DialogTitle>{paciente && paciente.id ? "Actualizar Paciente" : "Agregar Paciente"}</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent>
          <Grid container spacing={2}>
            {cabeceras.map((cabecera) => (
              <Grid item xs={12} sm={6} key={cabecera.id}>
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
                  type={cabecera.id === "edad" ? "number" : "text"}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCerrar} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {paciente && paciente.id ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalFormulario
