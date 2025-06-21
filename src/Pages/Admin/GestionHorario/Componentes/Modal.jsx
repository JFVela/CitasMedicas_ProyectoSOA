import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DialogActions, DialogContent } from "@mui/material";

// Styled components
const CampoFormulario = styled.div`
  width: 100%;
  display: flex;
`;

const ModalHorario = ({ abierto, onCerrar, onGuardar, horario, cabeceras }) => {
  const [formulario, setFormulario] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (horario) {
      setFormulario({ ...horario });
    } else {
      const nuevoFormulario = {};
      cabeceras.forEach((cabecera) => {
        nuevoFormulario[cabecera.id] = "";
      });
      setFormulario(nuevoFormulario);
    }
    setErrores({});
  }, [horario, cabeceras, abierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });

    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    // Validación de campos vacíos (excepto día de semana si ya tiene ID)
    cabeceras.forEach((cabecera) => {
      const valor = formulario[cabecera.id];
      if (
        (cabecera.id !== "dia_semana" || !formulario.id) && // solo valida día si es nuevo
        (!valor || valor.toString().trim() === "")
      ) {
        nuevosErrores[cabecera.id] = `El campo ${cabecera.label} es requerido`;
        esValido = false;
      }
    });

    // Validación de hora_inicio < hora_fin
    const [hIni, hFin] = [formulario.hora_inicio, formulario.hora_fin];
    if (hIni && hFin && hIni >= hFin) {
      nuevosErrores.hora_fin =
        "La hora final debe ser mayor que la hora de inicio";
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
      onClose={onCerrar}
      fullWidth
      maxWidth="sm"
      disableEnforceFocus
    >
      <DialogTitle>
        {horario?.id ? "Actualizar Horario" : "Agregar Horario"}
      </DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {cabeceras.map((cabecera) => (
            <CampoFormulario key={cabecera.id}>
              {cabecera.id === "dia_semana" ? (
                <TextField
                  fullWidth
                  label={cabecera.label}
                  name={cabecera.id}
                  value={formulario[cabecera.id] || ""}
                  InputProps={{
                    readOnly: !!formulario.id, // si tiene ID, es edición
                  }}
                  helperText={
                    formulario.id
                      ? "No se puede modificar el día de la semana"
                      : ""
                  }
                  onChange={manejarCambio}
                  error={!!errores[cabecera.id]}
                  disabled
                />
              ) : cabecera.id === "hora_inicio" ||
                cabecera.id === "hora_fin" ? (
                <TextField
                  fullWidth
                  label={cabecera.label}
                  name={cabecera.id}
                  type="time"
                  value={formulario[cabecera.id] || ""}
                  onChange={manejarCambio}
                  error={!!errores[cabecera.id]}
                  helperText={errores[cabecera.id] || ""}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min
                />
              ) : cabecera.id === "estado" ? (
                <TextField
                  select
                  fullWidth
                  label={cabecera.label}
                  name={cabecera.id}
                  value={formulario[cabecera.id] || ""}
                  onChange={manejarCambio}
                  error={!!errores[cabecera.id]}
                  helperText={errores[cabecera.id] || ""}
                  variant="outlined"
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </TextField>
              ) : null}
            </CampoFormulario>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {horario?.id ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalHorario;
