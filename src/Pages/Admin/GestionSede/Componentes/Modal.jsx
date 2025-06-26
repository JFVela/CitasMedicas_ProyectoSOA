import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DialogActions, DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const CampoFormulario = styled.div`
  width: 100%;
  display: flex;
`;

const ModalFormularioSede = ({
  abierto,
  onCerrar,
  onGuardar,
  sede,
  cabeceras,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (sede) {
      setFormulario({ ...sede });
    } else {
      const nuevoFormulario = {};
      cabeceras.forEach((cabecera) => {
        if (cabecera.id === "estado") {
          nuevoFormulario[cabecera.id] = "Activo";
        } else {
          nuevoFormulario[cabecera.id] = "";
        }
      });
      setFormulario(nuevoFormulario);
    }
    setErrores({});
  }, [sede, cabeceras, abierto]);

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

    cabeceras.forEach((cabecera) => {
      if (!formulario[cabecera.id] || formulario[cabecera.id].trim() === "") {
        nuevosErrores[cabecera.id] = `El campo ${cabecera.label} es requerido`;
        esValido = false;
      }
    });

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
      maxWidth="sm"
      disableEnforceFocus
    >
      <DialogTitle>{sede?.id ? "Actualizar Sede" : "Agregar Sede"}</DialogTitle>
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
                  variant="outlined"
                  disabled={guardando}
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
                  variant="outlined"
                  multiline={cabecera.id === "direccion"}
                  rows={cabecera.id === "direccion" ? 4 : 1}
                  disabled={guardando}
                />
              )}
            </CampoFormulario>
          ))}
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
            {guardando ? "Guardando..." : sede?.id ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalFormularioSede;
