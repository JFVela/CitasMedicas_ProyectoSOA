import { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
  Alert,
  styled,
} from "@mui/material";
import BotonAccion from "./Components/BotonAccion";
import CampoTexto from "./Components/CampoTexto";
import CampoSelect from "./Components/CampoSelect";
import TablaHorarios from "./Components/TablaHorarios";
import ResumenCita from "./Components/ResumenCita";

const PaperForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

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
const metodosPago = ["Efectivo", "Tarjeta", "Transferencia"];

const horariosTabla = [
  { id: 1, doctor: "Dr. Pérez", fecha: "12/06/25", hora: "08:00" },
  { id: 2, doctor: "Dra. López", fecha: "12/06/25", hora: "09:00" },
  { id: 3, doctor: "Dr. Gómez", fecha: "12/06/25", hora: "10:00" },
  { id: 4, doctor: "Dra. Ruiz", fecha: "12/06/25", hora: "11:00" },
];

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
    doctor: "",
    fecha: "",
  });
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(false);

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
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarHorario = (fila) => {
    setDatos({
      ...datos,
      horario: fila.hora,
      doctor: fila.doctor,
      fecha: fila.fecha,
    });
    setErrores({ ...errores, horario: undefined });
  };

  const handleNext = () => {
    if (validarPaso()) setPaso((prev) => prev + 1);
  };

  const handleBack = () => {
    setPaso((prev) => prev - 1);
  };

  const handleImprimir = () => {
    setAlerta(true);
    setTimeout(() => setAlerta(false), 2000);
  };

  const renderFormularioPaso = (paso) => {
    switch (paso) {
      case 0:
        return (
          <CampoTexto
            label="DNI"
            name="dni"
            value={datos.dni}
            error={errores.dni}
            onChange={manejarCambio}
            autoFocus
          />
        );
      case 1:
        return (
          <>
            <CampoTexto
              label="Correo electrónico"
              name="correo"
              value={datos.correo}
              error={errores.correo}
              onChange={manejarCambio}
            />
            <CampoTexto
              label="Teléfono"
              name="telefono"
              value={datos.telefono}
              error={errores.telefono}
              onChange={manejarCambio}
            />
          </>
        );
      case 2:
        return (
          <>
            <CampoSelect
              label="Sede"
              name="sede"
              value={datos.sede}
              opciones={sedes}
              error={errores.sede}
              onChange={manejarCambio}
            />
            <CampoSelect
              label="Especialidad"
              name="especialidad"
              value={datos.especialidad}
              opciones={especialidades}
              error={errores.especialidad}
              onChange={manejarCambio}
            />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Seleccione un horario disponible
            </Typography>
            <TablaHorarios
              horarios={horariosTabla}
              horarioSeleccionado={datos.horario}
              onSeleccionar={seleccionarHorario}
            />
            <Box sx={{ mb: 2 }}>
              <CampoTexto
                label="Descripción de síntomas"
                name="sintomas"
                value={datos.sintomas}
                error={errores.sintomas}
                onChange={manejarCambio}
                multiline
                minRows={2}
              />
            </Box>
          </>
        );
      case 4:
        return (
          <CampoSelect
            label="Método de pago"
            name="metodoPago"
            value={datos.metodoPago}
            opciones={metodosPago}
            error={errores.metodoPago}
            onChange={manejarCambio}
          />
        );
      case 5:
        return (
          <>
            <ResumenCita datos={datos} />
            <Box sx={{ mt: 2 }}>
              <BotonAccion onClick={handleImprimir}>Imprimir</BotonAccion>
              {alerta && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  ¡Impresión simulada! 😄
                </Alert>
              )}
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <PaperForm>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de Cita Médica
        </Typography>
        <Stepper activeStep={paso} orientation="vertical">
          {pasos.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box component="form" noValidate autoComplete="off">
                  {renderFormularioPaso(index)}
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    {index > 0 && index < pasos.length && (
                      <BotonAccion onClick={handleBack} variant="outlined">
                        Anterior
                      </BotonAccion>
                    )}
                    {index < pasos.length - 1 && (
                      <BotonAccion variant="contained" onClick={handleNext}>
                        {index === pasos.length - 2 ? "Finalizar" : "Siguiente"}
                      </BotonAccion>
                    )}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </PaperForm>
    </Container>
  );
}
