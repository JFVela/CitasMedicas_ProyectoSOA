import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

// Estructura de columnas
const FormSection = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalDisponibilidad = ({
  abierto,
  onCerrar,
  onGuardar,
  registro,
  doctores,
  sedes,
  horarios,
  guardando,
}) => {
  const [formulario, setFormulario] = useState({
    doctor: { id: "", nombre: "" },
    sede: { id: "", nombre: "" },
    horario: { id: "", nombre: "" },
    fechaInicio: "",
    fechaFin: "",
    estado: "Activo",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (registro) {
      setFormulario({
        doctor: registro.doctor,
        sede: registro.sede,
        horario: registro.horario,
        fechaInicio: registro.fechaInicio,
        fechaFin: registro.fechaFin,
        estado: registro.estado,
      });
    } else {
      setFormulario({
        doctor: { id: "", nombre: "" },
        sede: { id: "", nombre: "" },
        horario: { id: "", nombre: "" },
        fechaInicio: "",
        fechaFin: "",
        estado: "Activo",
      });
    }
    setErrores({});
  }, [registro, abierto]);

  const manejarCambio = (campo, valor) => {
    switch (campo) {
      case "doctorId":
        const doctorSeleccionado = doctores.find((d) => d.id === valor);
        setFormulario({
          ...formulario,
          doctor: {
            id: valor,
            nombre: doctorSeleccionado
              ? `${doctorSeleccionado.nombres} ${doctorSeleccionado.apellidos}`
              : "",
          },
        });
        break;

      case "sedeId":
        const sedeSeleccionada = sedes.find((s) => s.id === valor);
        setFormulario({
          ...formulario,
          sede: {
            id: valor,
            nombre: sedeSeleccionada ? sedeSeleccionada.nombre : "",
          },
        });
        break;

      case "horarioId":
        const horarioSeleccionado = horarios.find((h) => h.id === valor);
        setFormulario({
          ...formulario,
          horario: {
            id: valor,
            nombre: horarioSeleccionado
              ? `${
                  horarioSeleccionado.diaSemana
                } ${horarioSeleccionado.horaInicio?.slice(
                  0,
                  5
                )} - ${horarioSeleccionado.horaFin?.slice(0, 5)}`
              : "",
          },
        });
        break;

      default:
        setFormulario({ ...formulario, [campo]: valor });
        break;
    }

    if (errores[campo]) {
      setErrores({ ...errores, [campo]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    if (!formulario.doctor.id) {
      nuevosErrores.doctor = "Debe seleccionar un doctor";
      esValido = false;
    }

    if (!formulario.sede.id) {
      nuevosErrores.sede = "Debe seleccionar una sede";
      esValido = false;
    }

    if (!formulario.horario.id) {
      nuevosErrores.horario = "Debe seleccionar un horario";
      esValido = false;
    }

    if (!formulario.fechaInicio) {
      nuevosErrores.fechaInicio = "La fecha de inicio es requerida";
      esValido = false;
    }

    if (!formulario.fechaFin) {
      nuevosErrores.fechaFin = "La fecha de fin es requerida";
      esValido = false;
    }

    if (formulario.fechaInicio && formulario.fechaFin) {
      const inicio = new Date(formulario.fechaInicio);
      const fin = new Date(formulario.fechaFin);
      if (fin <= inicio) {
        nuevosErrores.fechaFin =
          "La fecha de fin debe ser posterior a la fecha de inicio";
        esValido = false;
      }
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar({ ...formulario, id: registro?.id || null });
    }
  };

  const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="md">
      <DialogTitle>
        {registro?.id ? "Editar Disponibilidad" : "Agregar Disponibilidad"}
      </DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          <FormSection>
            {/* COLUMNA IZQUIERDA: Doctor y Sede */}
            <Column>
              <TextField
                select
                fullWidth
                label="Doctor"
                value={formulario.doctor.id}
                onChange={(e) => manejarCambio("doctorId", e.target.value)}
                error={!!errores.doctor}
                helperText={errores.doctor}
              >
                <MenuItem value="">
                  <em>Seleccione un doctor</em>
                </MenuItem>
                {doctores
                  .filter((d) => d.estado === "Activo")
                  .map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {`${doctor.nombres} ${doctor.apellidos} - ${doctor.especialidad.nombre}`}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Sede"
                value={formulario.sede.id}
                onChange={(e) => manejarCambio("sedeId", e.target.value)}
                error={!!errores.sede}
                helperText={errores.sede}
              >
                <MenuItem value="">
                  <em>Seleccione una sede</em>
                </MenuItem>
                {sedes
                  .filter((s) => s.estado === "Activo")
                  .map((sede) => (
                    <MenuItem key={sede.id} value={sede.id}>
                      {`${sede.nombre} - ${sede.distrito}`}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Horario"
                value={formulario.horario.id}
                onChange={(e) => manejarCambio("horarioId", e.target.value)}
                error={!!errores.horario}
                helperText={errores.horario}
              >
                <MenuItem value="">
                  <em>Seleccione un horario</em>
                </MenuItem>
                {horarios
                  .filter((h) => h.estado === "Activo")
                  .map((horario) => (
                    <MenuItem key={horario.id} value={horario.id}>
                      {`${horario.diaSemana} de ${horario.horaInicio?.slice(
                        0,
                        5
                      )} a ${horario.horaFin?.slice(0, 5)}`}
                    </MenuItem>
                  ))}
              </TextField>
            </Column>

            {/* COLUMNA DERECHA: Horario, Fechas, Estado */}
            <Column>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Inicio"
                value={formulario.fechaInicio}
                onChange={(e) => manejarCambio("fechaInicio", e.target.value)}
                error={!!errores.fechaInicio}
                helperText={errores.fechaInicio}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: obtenerFechaHoy() }}
              />

              <TextField
                fullWidth
                type="date"
                label="Fecha de Fin"
                value={formulario.fechaFin}
                onChange={(e) => manejarCambio("fechaFin", e.target.value)}
                error={!!errores.fechaFin}
                helperText={errores.fechaFin}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: formulario.fechaInicio || obtenerFechaHoy(),
                }}
              />

              <TextField
                select
                fullWidth
                label="Estado"
                value={formulario.estado}
                onChange={(e) => manejarCambio("estado", e.target.value)}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Column>
          </FormSection>
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
              : registro?.id
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalDisponibilidad;
