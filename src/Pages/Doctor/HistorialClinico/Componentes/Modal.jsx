import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const ModalHistorial = ({
  abierto,
  onCerrar,
  onGuardar,
  registro,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({
    diagnostico: "",
    tratamiento: "",
    receta: "",
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (registro) {
      setFormulario({
        diagnostico: registro.diagnostico || "",
        tratamiento: registro.tratamiento || "",
        receta: registro.receta || "",
      });
    } else {
      setFormulario({
        diagnostico: "",
        tratamiento: "",
        receta: "",
      });
    }
    setErrores({});
  }, [registro, abierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    let valido = true;

    if (!formulario.diagnostico || formulario.diagnostico.trim() === "") {
      nuevosErrores.diagnostico = "El diagnóstico es obligatorio";
      valido = false;
    }

    if (!formulario.tratamiento || formulario.tratamiento.trim() === "") {
      nuevosErrores.tratamiento = "El tratamiento es obligatorio";
      valido = false;
    }

    if (!formulario.receta || formulario.receta.trim() === "") {
      nuevosErrores.receta = "La receta es obligatoria";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validar()) {
      onGuardar({ ...registro, ...formulario });
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-ES");
  };

  const formatearFechaHora = (fechaHora) => {
    if (!fechaHora) return "";
    const fechaObj = new Date(fechaHora);
    return fechaObj.toLocaleString("es-ES");
  };

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Editar Historial Médico</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          {/* Información de solo lectura */}
          {registro && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información del Historial
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Paciente:</strong> {registro.paciente}
                </Typography>
                <Typography variant="body2">
                  <strong>Doctor:</strong> {registro.doctor}
                </Typography>
                <Typography variant="body2">
                  <strong>Especialidad:</strong> {registro.especialidad}
                </Typography>
                <Typography variant="body2">
                  <strong>Sede:</strong> {registro.sede}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha de la Cita:</strong>{" "}
                  {formatearFecha(registro.fechaCita)}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha de Registro:</strong>{" "}
                  {formatearFechaHora(registro.fechaRegistro)}
                </Typography>
              </Box>
              <Divider />
            </Box>
          )}

          {/* Campos editables */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Campos Editables
            </Typography>
          </Box>

          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <TextField
              fullWidth
              name="diagnostico"
              label="Diagnóstico"
              value={formulario.diagnostico}
              onChange={manejarCambio}
              disabled={guardando}
              error={!!errores.diagnostico}
              helperText={
                errores.diagnostico || "Ingrese el diagnóstico médico"
              }
              multiline
              rows={3}
              placeholder="Describa el diagnóstico del paciente..."
            />

            <TextField
              fullWidth
              name="tratamiento"
              label="Tratamiento"
              value={formulario.tratamiento}
              onChange={manejarCambio}
              disabled={guardando}
              error={!!errores.tratamiento}
              helperText={
                errores.tratamiento || "Ingrese el tratamiento recomendado"
              }
              multiline
              rows={4}
              placeholder="Describa el tratamiento a seguir..."
            />

            <TextField
              fullWidth
              name="receta"
              label="Receta Médica"
              value={formulario.receta}
              onChange={manejarCambio}
              disabled={guardando}
              error={!!errores.receta}
              helperText={errores.receta || "Ingrese la receta médica"}
              multiline
              rows={4}
              placeholder="Detalle los medicamentos y dosis..."
            />
          </section>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} color="secondary" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={guardando}
            startIcon={guardando && <CircularProgress size={20} />}
          >
            {guardando ? "Actualizando..." : "Actualizar Historial"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalHistorial;
