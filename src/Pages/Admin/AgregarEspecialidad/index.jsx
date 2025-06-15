import { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Paper,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const pasos = [
  "DNI del paciente",
  "Información personal",
  "Sede y especialidad",
  "Horario y síntomas",
  "Método de pago",
  "Resumen",
];

const sedes = ["Sede Central", "Sede Norte", "Sede Sur"];
const especialidades = ["Cardiología", "Dermatología", "Pediatría"];
const horarios = ["08:00", "09:00", "10:00", "11:00"];
const metodosPago = ["Efectivo", "Tarjeta", "Transferencia"];

export default function FormularioPaciente() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({
    dni: "",
    correo: "",
    telefono: "",
    sede: "",
    especialidad: "",
    horario: "",
    sintomas: "",
    metodoPago: "",
  });
  const [errores, setErrores] = useState({});

  const validarPaso = () => {
    let nuevosErrores = {};
    if (paso === 0 && !datos.dni) nuevosErrores.dni = "Ingrese el DNI";
    if (paso === 1) {
      if (!datos.correo) nuevosErrores.correo = "Ingrese el correo";
      if (!datos.telefono) nuevosErrores.telefono = "Ingrese el teléfono";
    }
    if (paso === 2) {
      if (!datos.sede) nuevosErrores.sede = "Seleccione la sede";
      if (!datos.especialidad)
        nuevosErrores.especialidad = "Seleccione la especialidad";
    }
    if (paso === 3) {
      if (!datos.horario) nuevosErrores.horario = "Seleccione el horario";
      if (!datos.sintomas) nuevosErrores.sintomas = "Describa los síntomas";
    }
    if (paso === 4 && !datos.metodoPago)
      nuevosErrores.metodoPago = "Seleccione el método de pago";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const siguiente = (e) => {
    e.preventDefault();
    if (validarPaso()) setPaso((prev) => prev + 1);
  };

  const anterior = () => setPaso((prev) => prev - 1);

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de Cita Médica
        </Typography>
        <Stepper activeStep={paso} alternativeLabel>
          {pasos.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box component="form" onSubmit={siguiente} sx={{ mt: 2 }}>
          {paso === 0 && (
            <TextField
              label="DNI"
              name="dni"
              value={datos.dni}
              onChange={manejarCambio}
              fullWidth
              error={!!errores.dni}
              helperText={errores.dni}
              autoFocus
            />
          )}
          {paso === 1 && (
            <>
              <TextField
                label="Correo electrónico"
                name="correo"
                value={datos.correo}
                onChange={manejarCambio}
                fullWidth
                error={!!errores.correo}
                helperText={errores.correo}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Teléfono"
                name="telefono"
                value={datos.telefono}
                onChange={manejarCambio}
                fullWidth
                error={!!errores.telefono}
                helperText={errores.telefono}
              />
            </>
          )}
          {paso === 2 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }} error={!!errores.sede}>
                <InputLabel>Sede</InputLabel>
                <Select
                  name="sede"
                  value={datos.sede}
                  label="Sede"
                  onChange={manejarCambio}
                >
                  {sedes.map((sede) => (
                    <MenuItem key={sede} value={sede}>
                      {sede}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error" variant="caption">
                  {errores.sede}
                </Typography>
              </FormControl>
              <FormControl fullWidth error={!!errores.especialidad}>
                <InputLabel>Especialidad</InputLabel>
                <Select
                  name="especialidad"
                  value={datos.especialidad}
                  label="Especialidad"
                  onChange={manejarCambio}
                >
                  {especialidades.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error" variant="caption">
                  {errores.especialidad}
                </Typography>
              </FormControl>
            </>
          )}
          {paso === 3 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }} error={!!errores.horario}>
                <InputLabel>Horario</InputLabel>
                <Select
                  name="horario"
                  value={datos.horario}
                  label="Horario"
                  onChange={manejarCambio}
                >
                  {horarios.map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error" variant="caption">
                  {errores.horario}
                </Typography>
              </FormControl>
              <TextField
                label="Descripción de síntomas"
                name="sintomas"
                value={datos.sintomas}
                onChange={manejarCambio}
                fullWidth
                multiline
                minRows={2}
                error={!!errores.sintomas}
                helperText={errores.sintomas}
              />
            </>
          )}
          {paso === 4 && (
            <FormControl fullWidth error={!!errores.metodoPago}>
              <InputLabel>Método de pago</InputLabel>
              <Select
                name="metodoPago"
                value={datos.metodoPago}
                label="Método de pago"
                onChange={manejarCambio}
              >
                {metodosPago.map((mp) => (
                  <MenuItem key={mp} value={mp}>
                    {mp}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {errores.metodoPago}
              </Typography>
            </FormControl>
          )}
          {paso === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumen de la cita
              </Typography>
              <ul>
                <li>
                  <b>DNI:</b> {datos.dni}
                </li>
                <li>
                  <b>Correo:</b> {datos.correo}
                </li>
                <li>
                  <b>Teléfono:</b> {datos.telefono}
                </li>
                <li>
                  <b>Sede:</b> {datos.sede}
                </li>
                <li>
                  <b>Especialidad:</b> {datos.especialidad}
                </li>
                <li>
                  <b>Horario:</b> {datos.horario}
                </li>
                <li>
                  <b>Síntomas:</b> {datos.sintomas}
                </li>
                <li>
                  <b>Método de pago:</b> {datos.metodoPago}
                </li>
              </ul>
              <Button variant="contained" color="primary" disabled>
                Imprimir
              </Button>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {paso > 0 && paso < 5 && (
              <Button onClick={anterior} variant="outlined">
                Anterior
              </Button>
            )}
            {paso < 5 && (
              <Button type="submit" variant="contained">
                {paso === 4 ? "Finalizar" : "Siguiente"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
