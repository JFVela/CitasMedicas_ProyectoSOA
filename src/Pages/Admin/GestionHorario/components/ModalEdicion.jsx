import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function ModalEdicion({ abierto, tarea, onCerrar, onGuardar }) {
  const [tareaEditando, setTareaEditando] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (tarea && abierto) {
      console.log("Cargando tarea en modal:", tarea); // Para debugging
      // Convertir las horas de string a dayjs
      const horaInicioDayjs = convertirHora12ADayjs(tarea.horaInicio);
      const horaFinDayjs = convertirHora12ADayjs(tarea.horaFin);

      setTareaEditando({
        ...tarea,
        horaInicio: horaInicioDayjs,
        horaFin: horaFinDayjs,
      });
    }
    setErrores({});
  }, [tarea, abierto]);

  const convertirHora12ADayjs = (hora12) => {
    if (!hora12) return null;
    try {
      // Parsear hora en formato "8:00 AM" a dayjs
      return dayjs(hora12, "h:mm A");
    } catch (error) {
      console.error("Error al convertir hora:", error);
      return null;
    }
  };

  const convertirDayjsAHora12 = (dayjsTime) => {
    if (!dayjsTime || !dayjsTime.isValid()) return "";
    return dayjsTime.format("h:mm A");
  };

  const validarFormulario = () => {
    if (!tareaEditando) return false;

    const nuevosErrores = {};

    if (tareaEditando.horaInicio && tareaEditando.horaFin) {
      const inicioMinutos =
        tareaEditando.horaInicio.hour() * 60 +
        tareaEditando.horaInicio.minute();
      const finMinutos =
        tareaEditando.horaFin.hour() * 60 + tareaEditando.horaFin.minute();

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

      // Convertir de dayjs a formato 12 horas antes de enviar
      const tareaParaEnviar = {
        ...tareaEditando,
        horaInicio: convertirDayjsAHora12(tareaEditando.horaInicio),
        horaFin: convertirDayjsAHora12(tareaEditando.horaFin),
      };

      console.log("Tarea a actualizar:", tareaParaEnviar); // Para debugging

      const exito = await onGuardar(tareaParaEnviar);
      if (exito !== false) {
        // El modal se cerrará desde el componente padre
      }
    } catch (error) {
      console.error("Error en modal:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (!tareaEditando) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={abierto}
        onClose={!guardando ? onCerrar : undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Horario - {tareaEditando.dia}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TimeField
                label="Hora Inicio"
                value={tareaEditando.horaInicio}
                onChange={(newValue) =>
                  setTareaEditando({ ...tareaEditando, horaInicio: newValue })
                }
                format="h:mm A"
                disabled={guardando}
                slotProps={{
                  textField: {
                    error: !!errores.horaInicio,
                    helperText: errores.horaInicio,
                    fullWidth: true,
                  },
                }}
              />

              <TimeField
                label="Hora Fin"
                value={tareaEditando.horaFin}
                onChange={(newValue) =>
                  setTareaEditando({ ...tareaEditando, horaFin: newValue })
                }
                format="h:mm A"
                disabled={guardando}
                slotProps={{
                  textField: {
                    error: !!errores.horaFin,
                    helperText: errores.horaFin,
                    fullWidth: true,
                  },
                }}
              />
            </Box>

            {errores.horaFin && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mb: 2 }}>
                {errores.horaFin}
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={tareaEditando.activo}
                  onChange={(e) =>
                    setTareaEditando({
                      ...tareaEditando,
                      activo: e.target.checked,
                    })
                  }
                  color="primary"
                  disabled={guardando}
                />
              }
              label={`Estado: ${tareaEditando.activo ? "Activo" : "Inactivo"}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCerrar} color="secondary" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            onClick={manejarGuardar}
            variant="contained"
            color="primary"
            disabled={guardando}
            startIcon={guardando ? <CircularProgress size={20} /> : null}
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
