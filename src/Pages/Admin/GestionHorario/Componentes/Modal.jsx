import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DialogActions, DialogContent, CircularProgress } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CampoFormulario = styled.div`
  width: 100%;
  display: flex;
`;

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const convertirHora24 = (timeObj) => {
  if (!dayjs.isDayjs(timeObj)) return "";
  return timeObj.format("HH:mm:00"); // segundos fijos en "00"
};

const parsearHora = (horaStr) => {
  if (!horaStr) return null;
  const [hora, minuto] = horaStr.split(":");
  return dayjs().hour(+hora).minute(+minuto).second(0);
};

const ModalHorario = ({
  abierto,
  onCerrar,
  onGuardar,
  horario,
  cabeceras,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (horario) {
      setFormulario({
        ...horario,
        dia_semana: horario.diaSemana || "",
        hora_inicio: parsearHora(horario.horaInicio),
        hora_fin: parsearHora(horario.horaFin),
        estado: horario.estado || "Activo",
      });
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

  const manejarHora = (name, value) => {
    const hora = value ? value.second(0) : null;
    setFormulario({
      ...formulario,
      [name]: hora,
    });
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    if (!formulario.dia_semana || formulario.dia_semana.trim() === "") {
      nuevosErrores.dia_semana = "El campo Día de la Semana es requerido";
      esValido = false;
    }

    if (!formulario.hora_inicio) {
      nuevosErrores.hora_inicio = "La hora de inicio es requerida";
      esValido = false;
    }

    if (!formulario.hora_fin) {
      nuevosErrores.hora_fin = "La hora de fin es requerida";
      esValido = false;
    }

    if (
      formulario.hora_inicio &&
      formulario.hora_fin &&
      formulario.hora_inicio.isAfter(formulario.hora_fin)
    ) {
      nuevosErrores.hora_fin =
        "La hora final debe ser mayor que la hora de inicio";
      esValido = false;
    }

    if (!formulario.estado) {
      nuevosErrores.estado = "El campo Estado es requerido";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const datosParaGuardar = {
        ...formulario,
        diaSemana: formulario.dia_semana,
        horaInicio: convertirHora24(formulario.hora_inicio),
        horaFin: convertirHora24(formulario.hora_fin),
      };
      onGuardar(datosParaGuardar);
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
      <DialogTitle>
        {horario?.id ? "Actualizar Horario" : "Agregar Horario"}
      </DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <CampoFormulario>
            <TextField
              select
              fullWidth
              label="Día de la Semana"
              name="dia_semana"
              value={formulario.dia_semana || ""}
              onChange={manejarCambio}
              error={!!errores.dia_semana}
              helperText={errores.dia_semana || ""}
              disabled={guardando}
            >
              {diasSemana.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </TextField>
          </CampoFormulario>

          <CampoFormulario>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                ampm
                label="Hora de Inicio"
                value={formulario.hora_inicio || null}
                onChange={(newValue) => manejarHora("hora_inicio", newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errores.hora_inicio,
                    helperText: errores.hora_inicio,
                  },
                }}
              />
            </LocalizationProvider>
          </CampoFormulario>

          <CampoFormulario>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                ampm
                label="Hora de Fin"
                value={formulario.hora_fin || null}
                onChange={(newValue) => manejarHora("hora_fin", newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errores.hora_fin,
                    helperText: errores.hora_fin,
                  },
                }}
              />
            </LocalizationProvider>
          </CampoFormulario>

          <CampoFormulario>
            <TextField
              select
              fullWidth
              label="Estado"
              name="estado"
              value={formulario.estado || ""}
              onChange={manejarCambio}
              error={!!errores.estado}
              helperText={errores.estado || ""}
              disabled={guardando}
            >
              <MenuItem value={"Activo"}>Activo</MenuItem>
              <MenuItem value={"Inactivo"}>Inactivo</MenuItem>
            </TextField>
          </CampoFormulario>
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
              : horario?.id
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalHorario;
