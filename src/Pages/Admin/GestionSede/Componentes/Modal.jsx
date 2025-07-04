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

const capitalizarOracion = (texto) => {
  return texto
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
};

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
        nuevoFormulario[cabecera.id] = cabecera.id === "estado" ? "Activo" : "";
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
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    const nombre = (formulario.nombre || "").trim();
    const direccion = (formulario.direccion || "").trim();
    const distrito = (formulario.distrito || "").trim();

    if (!nombre) {
      nuevosErrores.nombre = "El campo Nombre es requerido";
      esValido = false;
    } else if (/\d/.test(nombre)) {
      nuevosErrores.nombre = "El Nombre no debe contener números";
      esValido = false;
    }

    if (!direccion) {
      nuevosErrores.direccion = "El campo Dirección es requerido";
      esValido = false;
    } else if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(direccion)) {
      nuevosErrores.direccion = "La Dirección debe contener al menos una letra";
      esValido = false;
    }

    if (!distrito) {
      nuevosErrores.distrito = "El campo Distrito es requerido";
      esValido = false;
    } else if (/\d/.test(distrito)) {
      nuevosErrores.distrito = "El Distrito no debe contener números";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const formateado = { ...formulario };
    formateado.nombre = capitalizarOracion(formateado.nombre || "");
    formateado.distrito = capitalizarOracion(formateado.distrito || "");
    formateado.direccion = capitalizarOracion(formateado.direccion || "");

    if (validarFormulario()) {
      onGuardar(formateado);
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
                  variant="outlined"
                  disabled={!sede?.id || guardando} // solo habilitado al editar
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
                  variant="outlined"
                  multiline={cabecera.id === "direccion"}
                  rows={cabecera.id === "direccion" ? 4 : 1}
                  disabled={guardando}
                  error={!!errores[cabecera.id]}
                  helperText={errores[cabecera.id] || ""}
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
