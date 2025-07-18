import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const estadosCita = [
  { valor: "Pendiente", label: "Pendiente" },
  { valor: "Confirmada", label: "Confirmada" },
  { valor: "Rechazada", label: "Rechazada" },
  { valor: "Finalizada", label: "Finalizada" },
  { valor: "Inactivo", label: "Inactivo" },
];

const ModalCita = ({
  abierto,
  onCerrar,
  onGuardar,
  cita,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({ estado: "" });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (cita && abierto) {
      setFormulario({ estado: cita.estado || "" });
    } else {
      setFormulario({ estado: "" });
    }
    setErrores({});
  }, [cita, abierto]);

  const manejarCambio = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor });
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    if (!formulario.estado || formulario.estado.trim() === "") {
      nuevosErrores.estado = "El estado es requerido";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar({ ...cita, estado: formulario.estado }); // ← devolvemos la cita con nuevo estado
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha + "T00:00:00");
    return fechaObj.toLocaleDateString("es-ES");
  };

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Editar Estado de Cita</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          {cita && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información de la Cita
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Paciente:</strong> {cita.paciente}
                </Typography>
                <Typography variant="body2">
                  <strong>Doctor:</strong> {cita.doctor}
                </Typography>
                <Typography variant="body2">
                  <strong>Especialidad:</strong> {cita.especialidad}
                </Typography>
                <Typography variant="body2">
                  <strong>Sede:</strong> {cita.sede}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {formatearFecha(cita.fecha)}
                </Typography>
                <Typography variant="body2">
                  <strong>Horario:</strong> {cita.horario}
                </Typography>
                <Typography variant="body2">
                  <strong>Motivo de consulta:</strong> {cita.motivo}
                </Typography>
              </Box>
              <Divider />
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6">Cambiar Estado</Typography>
            <TextField
              select
              fullWidth
              label="Estado de la Cita"
              value={formulario.estado}
              onChange={(e) => manejarCambio("estado", e.target.value)}
              error={!!errores.estado}
              helperText={
                errores.estado || "Seleccione el nuevo estado de la cita"
              }
              variant="outlined"
              disabled={guardando}
            >
              {estadosCita.map((opcion) => (
                <MenuItem key={opcion.valor} value={opcion.valor}>
                  {opcion.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalCita;
