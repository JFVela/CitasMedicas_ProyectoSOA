import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DialogActions, DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// Contenedor general de los campos en dos columnas
const CamposContenedor = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;

// Campo individual con tamaño flexible
const CampoFormulario = styled.div`
  flex: 1 1 48%;
  min-width: 200px;
`;

const ModalPaciente = ({
  abierto,
  onCerrar,
  onGuardar,
  paciente,
  cabeceras,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (paciente) {
      setFormulario({
        ...paciente,
        fechaNacimiento: paciente.fechaNacimiento
          ? paciente.fechaNacimiento.substring(0, 10)
          : "",
      });
    } else {
      const nuevoFormulario = {};
      cabeceras.forEach((cabecera) => {
        if (cabecera.id === "estado") {
          nuevoFormulario[cabecera.id] = "Activo"; // Activo por defecto
        } else if (cabecera.id === "sexo") {
          nuevoFormulario[cabecera.id] = "M";
        } else {
          nuevoFormulario[cabecera.id] = "";
        }
      });
      setFormulario(nuevoFormulario);
    }
    setErrores({});
  }, [paciente, cabeceras, abierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formulario.nombres || "")) {
      nuevosErrores.nombres = "Solo letras permitidas";
      esValido = false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formulario.apellidos || "")) {
      nuevosErrores.apellidos = "Solo letras permitidas";
      esValido = false;
    }

    if (!/^\d{8}$/.test(formulario.dni || "")) {
      nuevosErrores.dni = "Debe tener 8 dígitos exactos";
      esValido = false;
    }

    if (!/^[\w.-]+@(gmail|hotmail)\.com$/.test(formulario.correo || "")) {
      nuevosErrores.correo = "Correo inválido (solo gmail o hotmail)";
      esValido = false;
    }

    if (!/^9\d{8}$/.test(formulario.celular || "")) {
      nuevosErrores.celular = "Debe comenzar con 9 y tener 9 dígitos";
      esValido = false;
    }

    if (!formulario.direccion || formulario.direccion.length > 100) {
      nuevosErrores.direccion = "Máximo 100 caracteres";
      esValido = false;
    }

    if (!formulario.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha es obligatoria";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar(formulario);
    }
  };

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="md"
      disableEnforceFocus
    >
      <DialogTitle>
        {paciente?.id ? "Actualizar Paciente" : "Agregar Paciente"}
      </DialogTitle>

      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          <CamposContenedor>
            <CampoFormulario>
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                value={formulario.nombres || ""}
                onChange={manejarCambio}
                error={!!errores.nombres}
                helperText={errores.nombres}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={formulario.apellidos || ""}
                onChange={manejarCambio}
                error={!!errores.apellidos}
                helperText={errores.apellidos}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formulario.dni || ""}
                onChange={manejarCambio}
                error={!!errores.dni}
                helperText={errores.dni}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                value={formulario.correo || ""}
                onChange={manejarCambio}
                error={!!errores.correo}
                helperText={errores.correo}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                label="Celular"
                name="celular"
                value={formulario.celular || ""}
                onChange={manejarCambio}
                error={!!errores.celular}
                helperText={errores.celular}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formulario.direccion || ""}
                onChange={manejarCambio}
                error={!!errores.direccion}
                helperText={errores.direccion}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                InputLabelProps={{ shrink: true }}
                value={formulario.fechaNacimiento || ""}
                onChange={manejarCambio}
                error={!!errores.fechaNacimiento}
                helperText={errores.fechaNacimiento}
                disabled={guardando}
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                select
                fullWidth
                label="Sexo"
                name="sexo"
                value={formulario.sexo || ""}
                onChange={manejarCambio}
                disabled={guardando}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
              </TextField>
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                select
                fullWidth
                label="Estado"
                name="estado"
                value={formulario.estado || "Activo"}
                onChange={manejarCambio}
                disabled={guardando}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </CampoFormulario>
          </CamposContenedor>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} color="secondary" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={guardando}
            startIcon={guardando ? <CircularProgress size={20} /> : null}
          >
            {guardando
              ? "Guardando..."
              : paciente?.id
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalPaciente;
