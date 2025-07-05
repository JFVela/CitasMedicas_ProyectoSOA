import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DialogActions, DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// Estilos
const CamposContenedor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CampoFormulario = styled.div`
  width: 100%;
`;

const InfoPaciente = styled.div`
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ModalHistorial = ({
  abierto,
  onCerrar,
  onGuardar,
  cita,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({
    diagnostico: "",
    tratamiento: "",
    receta: "",
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (abierto) {
      // Resetear formulario cuando se abre el modal
      setFormulario({
        diagnostico: "",
        tratamiento: "",
        receta: "",
      });
      setErrores({});
    }
  }, [abierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    // Limpiar error del campo
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    if (!formulario.diagnostico || formulario.diagnostico.trim() === "") {
      nuevosErrores.diagnostico = "El diagnóstico es obligatorio";
      esValido = false;
    } else if (formulario.diagnostico.length < 10) {
      nuevosErrores.diagnostico =
        "El diagnóstico debe tener al menos 10 caracteres";
      esValido = false;
    }

    if (!formulario.tratamiento || formulario.tratamiento.trim() === "") {
      nuevosErrores.tratamiento = "El tratamiento es obligatorio";
      esValido = false;
    } else if (formulario.tratamiento.length < 10) {
      nuevosErrores.tratamiento =
        "El tratamiento debe tener al menos 10 caracteres";
      esValido = false;
    }

    if (!formulario.receta || formulario.receta.trim() === "") {
      nuevosErrores.receta = "La receta es obligatoria";
      esValido = false;
    } else if (formulario.receta.length < 5) {
      nuevosErrores.receta = "La receta debe tener al menos 5 caracteres";
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

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Función para obtener estado de cita
  const obtenerEstadoCita = (estadoCita) => {
    const estados = {
      1: { texto: "Programada", color: "primary" },
      2: { texto: "En Proceso", color: "warning" },
      3: { texto: "Completada", color: "success" },
      4: { texto: "Cancelada", color: "error" },
    };
    return estados[estadoCita] || { texto: "Desconocido", color: "default" };
  };

  if (!cita) return null;

  const estadoCita = obtenerEstadoCita(cita.estadoCita);

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="md"
      disableEnforceFocus
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          📋 Crear Historial Médico
          <Chip
            label={estadoCita.texto}
            color={estadoCita.color}
            size="small"
          />
        </Box>
      </DialogTitle>

      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          {/* ✅ Información del Paciente y Cita */}
          <InfoPaciente>
            <Typography variant="h6" gutterBottom color="primary">
              👤 Información del Paciente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Typography variant="body2">
                <strong>Paciente:</strong> {cita.nombres} {cita.apellidos}
              </Typography>
              <Typography variant="body2">
                <strong>DNI:</strong> {cita.dni}
              </Typography>
              <Typography variant="body2">
                <strong>Celular:</strong> {cita.celular}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha de Cita:</strong> {formatearFecha(cita.fechaCita)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Motivo de Consulta:</strong> {cita.motivoConsulta}
            </Typography>
          </InfoPaciente>

          {/* ✅ Formulario de Historial */}
          <Typography variant="h6" gutterBottom color="secondary">
            🏥 Datos del Historial Médico
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <CamposContenedor>
            <CampoFormulario>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Diagnóstico"
                name="diagnostico"
                value={formulario.diagnostico}
                onChange={manejarCambio}
                error={!!errores.diagnostico}
                helperText={
                  errores.diagnostico ||
                  "Describe el diagnóstico médico detallado"
                }
                disabled={guardando}
                placeholder="Ej: Bronquitis aguda con componente alérgico..."
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Tratamiento"
                name="tratamiento"
                value={formulario.tratamiento}
                onChange={manejarCambio}
                error={!!errores.tratamiento}
                helperText={
                  errores.tratamiento || "Indica el tratamiento a seguir"
                }
                disabled={guardando}
                placeholder="Ej: Reposo relativo, nebulizaciones con salbutamol..."
              />
            </CampoFormulario>

            <CampoFormulario>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Receta Médica"
                name="receta"
                value={formulario.receta}
                onChange={manejarCambio}
                error={!!errores.receta}
                helperText={errores.receta || "Medicamentos y dosis prescritas"}
                disabled={guardando}
                placeholder="Ej: Amoxicilina 500mg cada 8 horas por 7 días..."
              />
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
            {guardando ? "Creando Historial..." : "Crear Historial"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalHistorial;
