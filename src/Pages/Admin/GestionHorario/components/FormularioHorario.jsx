import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";

const FormularioContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}));

export default function FormularioHorario({ onGuardar, diasSemana }) {
  const [formulario, setFormulario] = useState({
    dia: "",
    horaInicio: null,
    horaFin: null,
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor });
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: "" });
    }
  };

  const convertirDayjsAHora12 = (dayjsTime) => {
    if (!dayjsTime || !dayjsTime.isValid()) return "";
    return dayjsTime.format("h:mm A");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.dia) nuevosErrores.dia = "Selecciona un día";
    if (!formulario.horaInicio)
      nuevosErrores.horaInicio = "Selecciona hora de inicio";
    if (!formulario.horaFin) nuevosErrores.horaFin = "Selecciona hora de fin";

    if (formulario.horaInicio && formulario.horaFin) {
      const inicioMinutos =
        formulario.horaInicio.hour() * 60 + formulario.horaInicio.minute();
      const finMinutos =
        formulario.horaFin.hour() * 60 + formulario.horaFin.minute();

      if (inicioMinutos >= finMinutos) {
        nuevosErrores.horaFin =
          "La hora de fin debe ser posterior a la de inicio";
      }

      if (inicioMinutos === finMinutos) {
        nuevosErrores.horaFin = "La hora de inicio y fin no pueden ser iguales";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) return;

    try {
      setGuardando(true);

      // Convertir las horas de dayjs a formato 12 horas
      const formularioParaEnviar = {
        dia: formulario.dia,
        horaInicio: convertirDayjsAHora12(formulario.horaInicio),
        horaFin: convertirDayjsAHora12(formulario.horaFin),
      };

      console.log("Formulario a enviar:", formularioParaEnviar); // Para debugging

      const exito = await onGuardar(formularioParaEnviar);
      if (exito !== false) {
        // Solo limpiar si se guardó exitosamente
        setFormulario({ dia: "", horaInicio: null, horaFin: null });
        setErrores({});
      }
    } catch (error) {
      console.error("Error en formulario:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormularioContainer>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <AccessTimeIcon />
          Agregar Nuevo Horario
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <FormControl sx={{ minWidth: 150 }} error={!!errores.dia}>
            <InputLabel>Día de la Semana</InputLabel>
            <Select
              value={formulario.dia}
              onChange={(e) => manejarCambio("dia", e.target.value)}
              label="Día de la Semana"
              disabled={guardando}
            >
              {diasSemana.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </Select>
            {errores.dia && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errores.dia}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ minWidth: 150 }}>
            <TimeField
              label="Hora Inicio"
              value={formulario.horaInicio}
              onChange={(newValue) => manejarCambio("horaInicio", newValue)}
              format="h:mm A"
              disabled={guardando}
              slotProps={{
                textField: {
                  error: !!errores.horaInicio,
                  helperText: errores.horaInicio,
                },
              }}
            />
          </Box>

          <Box sx={{ minWidth: 150 }}>
            <TimeField
              label="Hora Fin"
              value={formulario.horaFin}
              onChange={(newValue) => manejarCambio("horaFin", newValue)}
              format="h:mm A"
              disabled={guardando}
              slotProps={{
                textField: {
                  error: !!errores.horaFin,
                  helperText: errores.horaFin,
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={manejarGuardar}
            startIcon={<SaveIcon />}
            sx={{ height: "56px", px: 3 }}
            size="large"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Horario"}
          </Button>
        </Box>
      </FormularioContainer>
    </LocalizationProvider>
  );
}
