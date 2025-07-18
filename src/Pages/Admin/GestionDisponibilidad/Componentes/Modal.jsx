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
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

// Estructura de columnas
const FormSection = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;
`;

const HorarioContainer = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fafafa;
`;

const SelectedHorariosContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 50px;
  background-color: #f9f9f9;
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
  // Estado inicial mejorado
  const [formulario, setFormulario] = useState({
    doctor: { id: "", nombre: "" },
    sede: { id: "", nombre: "" },
    horarios: [], // Cambio: array de horarios seleccionados
    fechaInicio: "",
    fechaFin: "",
    estado: "Activo",
  });
  const [errores, setErrores] = useState({});

  // Determinar si es modo edición
  const esEdicion = Boolean(registro?.id);

  // Efecto para cargar datos
  useEffect(() => {
    if (registro) {
      setFormulario({
        doctor: registro.doctor || { id: "", nombre: "" },
        sede: registro.sede || { id: "", nombre: "" },
        horarios: registro.horario ? [registro.horario] : [], // Convertir horario único a array
        fechaInicio: registro.fechaInicio || "",
        fechaFin: registro.fechaFin || "",
        estado: registro.estado || "Activo",
      });
    } else {
      // Formulario limpio para nuevo registro
      setFormulario({
        doctor: { id: "", nombre: "" },
        sede: { id: "", nombre: "" },
        horarios: [],
        fechaInicio: "",
        fechaFin: "",
        estado: "Activo", // Por defecto activo
      });
    }
    setErrores({});
  }, [registro, abierto]);

  // Manejador de cambios mejorado
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
            nombreCompleto: doctorSeleccionado
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

      case "horarioToggle":
        const horarioSeleccionado = horarios.find((h) => h.id === valor);
        if (horarioSeleccionado) {
          const horariosActuales = formulario.horarios;
          const yaSeleccionado = horariosActuales.some((h) => h.id === valor);

          if (yaSeleccionado) {
            // Remover horario
            setFormulario({
              ...formulario,
              horarios: horariosActuales.filter((h) => h.id !== valor),
            });
          } else {
            // Agregar horario
            const nuevoHorario = {
              id: valor,
              dia: horarioSeleccionado.diaSemana,
              horaInicio: horarioSeleccionado.horaInicio,
              horaFin: horarioSeleccionado.horaFin,
              textoCompleto: `${
                horarioSeleccionado.diaSemana
              } ${horarioSeleccionado.horaInicio?.slice(
                0,
                5
              )} - ${horarioSeleccionado.horaFin?.slice(0, 5)}`,
            };
            setFormulario({
              ...formulario,
              horarios: [...horariosActuales, nuevoHorario],
            });
          }
        }
        break;

      default:
        setFormulario({ ...formulario, [campo]: valor });
        break;
    }

    // Limpiar errores
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: "" });
    }
  };

  // Validación mejorada
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

    if (formulario.horarios.length === 0) {
      nuevosErrores.horarios = "Debe seleccionar al menos un horario";
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

  // Manejador de envío
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const registrosParaEnviar = formulario.horarios.map((horario) => ({
      ...formulario,
      horario,
      id: null, // es nuevo
    }));

    for (let i = 0; i < registrosParaEnviar.length; i++) {
      // Solo el último registro activa el alert
      const mostrarAlerta = i === registrosParaEnviar.length - 1;
      await onGuardar(registrosParaEnviar[i], mostrarAlerta);
    }

    onCerrar();
  };

  // Función auxiliar para fechas
  const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

  // Función para remover horario seleccionado
  const removerHorario = (horarioId) => {
    setFormulario({
      ...formulario,
      horarios: formulario.horarios.filter((h) => h.id !== horarioId),
    });
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6" component="div">
          {esEdicion ? "✏️ Editar Disponibilidad" : "➕ Agregar Disponibilidad"}
        </Typography>
      </DialogTitle>

      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          <FormSection>
            {/* COLUMNA IZQUIERDA: Doctor y Sede */}
            <Column>
              <TextField
                select
                fullWidth
                label="👨‍⚕️ Doctor"
                value={formulario.doctor.id}
                onChange={(e) => manejarCambio("doctorId", e.target.value)}
                error={!!errores.doctor}
                helperText={errores.doctor}
                disabled={guardando}
              >
                <MenuItem value="">
                  <em>Seleccione un doctor</em>
                </MenuItem>
                {doctores
                  .filter((d) => d.estado === "Activo")
                  .map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {`${doctor.nombres} ${doctor.apellidos} - ${
                        doctor.especialidad?.nombre || "Sin especialidad"
                      }`}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="🏥 Sede"
                value={formulario.sede.id}
                onChange={(e) => manejarCambio("sedeId", e.target.value)}
                error={!!errores.sede}
                helperText={errores.sede}
                disabled={guardando}
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

              {/* Fechas */}
              <TextField
                fullWidth
                type="date"
                label="📅 Fecha de Inicio"
                value={formulario.fechaInicio}
                onChange={(e) => manejarCambio("fechaInicio", e.target.value)}
                error={!!errores.fechaInicio}
                helperText={errores.fechaInicio}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: obtenerFechaHoy() }}
                disabled={guardando}
              />

              <TextField
                fullWidth
                type="date"
                label="📅 Fecha de Fin"
                value={formulario.fechaFin}
                onChange={(e) => manejarCambio("fechaFin", e.target.value)}
                error={!!errores.fechaFin}
                helperText={errores.fechaFin}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: formulario.fechaInicio || obtenerFechaHoy(),
                }}
                disabled={guardando}
              />

              {/* Estado - Solo habilitado en edición */}
              <TextField
                select
                fullWidth
                label="⚡ Estado"
                value={formulario.estado}
                onChange={(e) => manejarCambio("estado", e.target.value)}
                disabled={!esEdicion || guardando} // Solo habilitado al editar
                helperText={
                  !esEdicion
                    ? "El estado se establece como Activo por defecto"
                    : ""
                }
              >
                <MenuItem value="Activo">✅ Activo</MenuItem>
                <MenuItem value="Inactivo">❌ Inactivo</MenuItem>
              </TextField>
            </Column>

            {/* COLUMNA DERECHA: Horarios */}
            <Column>
              <FormControl error={!!errores.horarios} disabled={guardando}>
                <FormLabel component="legend">
                  <Typography variant="subtitle1" gutterBottom>
                    ⏰ Horarios Disponibles
                  </Typography>
                </FormLabel>

                {/* Horarios seleccionados */}
                {formulario.horarios.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="primary" gutterBottom>
                      Horarios seleccionados ({formulario.horarios.length}):
                    </Typography>
                    <SelectedHorariosContainer>
                      {formulario.horarios.map((horario) => (
                        <Chip
                          key={horario.id}
                          label={horario.textoCompleto}
                          onDelete={() => removerHorario(horario.id)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </SelectedHorariosContainer>
                  </Box>
                )}

                {/* Lista de horarios con checkboxes */}
                <HorarioContainer>
                  <FormGroup>
                    {horarios
                      .filter((h) => h.estado === "Activo")
                      .map((horario) => {
                        const estaSeleccionado = formulario.horarios.some(
                          (h) => h.id === horario.id
                        );
                        const textoHorario = `${
                          horario.diaSemana
                        } de ${horario.horaInicio?.slice(
                          0,
                          5
                        )} a ${horario.horaFin?.slice(0, 5)}`;

                        return (
                          <FormControlLabel
                            key={horario.id}
                            control={
                              <Checkbox
                                checked={estaSeleccionado}
                                onChange={() =>
                                  manejarCambio("horarioToggle", horario.id)
                                }
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={
                                    estaSeleccionado ? "bold" : "normal"
                                  }
                                >
                                  {textoHorario}
                                </Typography>
                              </Box>
                            }
                          />
                        );
                      })}
                  </FormGroup>
                </HorarioContainer>

                {errores.horarios && (
                  <FormHelperText>{errores.horarios}</FormHelperText>
                )}
              </FormControl>
            </Column>
          </FormSection>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={onCerrar}
            color="secondary"
            disabled={guardando}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={guardando || formulario.horarios.length === 0}
            startIcon={guardando ? <CircularProgress size={20} /> : null}
          >
            {guardando
              ? "Guardando..."
              : esEdicion
              ? "💾 Actualizar"
              : "💾 Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalDisponibilidad;
