import { useState, useEffect } from "react"
import styled from "styled-components"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import { DialogActions, DialogContent } from "@mui/material"

const CampoFormulario = styled.div`
  width: 100%;
  display: flex;
`

const ModalFormulario = ({
  abierto,
  onCerrar,
  onGuardar,
  registro,
  cabeceras,
  especialidades = [], // ✅ Agregado
}) => {
  const [formulario, setFormulario] = useState({})
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (registro) {
      setFormulario({ ...registro })
    } else {
      const nuevoFormulario = {}
      cabeceras.forEach((cabecera) => {
        if (cabecera.id === "estado") {
          nuevoFormulario[cabecera.id] = 1 // Estado activo por defecto
        } else {
          nuevoFormulario[cabecera.id] = ""
        }
      })
      // Agregar idEspecialidad para nuevos registros
      nuevoFormulario.idEspecialidad = ""
      setFormulario(nuevoFormulario)
    }
    setErrores({})
  }, [registro, cabeceras, abierto])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" })
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}
    let esValido = true

    // Validar campos básicos
    cabeceras.forEach((cabecera) => {
      if (cabecera.id !== "especialidad") {
        // No validar especialidad directamente
        if (!formulario[cabecera.id] || formulario[cabecera.id].toString().trim() === "") {
          nuevosErrores[cabecera.id] = `El campo ${cabecera.label} es requerido`
          esValido = false
        }
      }
    })

    // Validar especialidad solo para nuevos registros
    if (!registro && (!formulario.idEspecialidad || formulario.idEspecialidad === "")) {
      nuevosErrores.idEspecialidad = "La especialidad es requerida"
      esValido = false
    }

    setErrores(nuevosErrores)
    return esValido
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    if (validarFormulario()) {
      onGuardar(formulario)
    }
  }

  const renderizarCampo = (cabecera) => {
    // Campo de especialidad - solo mostrar, no editar si es edición
    if (cabecera.id === "especialidad") {
      if (registro?.id) {
        // Modo edición - mostrar especialidad como campo deshabilitado
        return (
          <TextField
            fullWidth
            label={cabecera.label}
            name={cabecera.id}
            value={formulario[cabecera.id] || ""}
            disabled
            helperText="No se puede modificar la especialidad"
          />
        )
      } else {
        // Modo agregar - mostrar select de especialidades
        return (
          <TextField
            select
            fullWidth
            label="Especialidad"
            name="idEspecialidad"
            value={formulario.idEspecialidad || ""}
            onChange={manejarCambio}
            error={!!errores.idEspecialidad}
            helperText={errores.idEspecialidad || ""}
          >
            <MenuItem value="">Seleccione una especialidad</MenuItem>
            {especialidades.map((esp) => (
              <MenuItem key={esp.id} value={esp.id}>
                {esp.nombre}
              </MenuItem>
            ))}
          </TextField>
        )
      }
    }

    // Campo de estado
    if (cabecera.id === "estado") {
      return (
        <TextField
          select
          fullWidth
          label={cabecera.label}
          name={cabecera.id}
          value={formulario[cabecera.id] || ""}
          onChange={manejarCambio}
          error={!!errores[cabecera.id]}
          helperText={errores[cabecera.id] || ""}
        >
          <MenuItem value={1}>Activo</MenuItem>
          <MenuItem value={0}>Inactivo</MenuItem>
        </TextField>
      )
    }

    // Campos normales
    return (
      <TextField
        fullWidth
        label={cabecera.label}
        name={cabecera.id}
        value={formulario[cabecera.id] || ""}
        onChange={manejarCambio}
        error={!!errores[cabecera.id]}
        helperText={errores[cabecera.id] || ""}
        multiline={cabecera.multiline || false}
        rows={cabecera.multiline ? 4 : 1}
      />
    )
  }

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="sm" disableEnforceFocus>
      <DialogTitle>{registro?.id ? "Actualizar Doctor" : "Agregar Doctor"}</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {cabeceras.map((cabecera) => (
            <CampoFormulario key={cabecera.id}>{renderizarCampo(cabecera)}</CampoFormulario>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {registro?.id ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalFormulario
