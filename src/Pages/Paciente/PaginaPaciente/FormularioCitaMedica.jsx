"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Person, Email, Phone, LocationOn, LocalHospital, Schedule, Payment, CheckCircle } from "@mui/icons-material"
import { TablaHorariosDoctores } from "../components/TablaHorariosDoctores"
import { usePersistenciaFormulario } from "../hooks/usePersistenciaFormulario"
import { usePrevenirRecarga } from "../hooks/usePrevenirRecarga"
import { horariosDoctores } from "../data/horariosDoctores"
import PasoDNI from "./Pasos/PasoDNI"
import PasoInfoPersonal from "./Pasos/PasoInfoPersonal"
import PasoSedeEspecialidad from "./Pasos/PasoSedeEspecialidad"
import PasoHorarioSintomas from "./Pasos/PasoHorarioSintomas"
import PasoMetodoPago from "./Pasos/PasoMetodoPago"
import PasoResumen from "./Pasos/PasoResumen"

const pasos = [
  { titulo: "DNI del paciente", icono: <Person /> },
  { titulo: "Información personal", icono: <Email /> },
  { titulo: "Sede y especialidad", icono: <LocationOn /> },
  { titulo: "Horario y síntomas", icono: <Schedule /> },
  { titulo: "Método de pago", icono: <Payment /> },
  { titulo: "Resumen", icono: <CheckCircle /> },
]

const sedes = ["Sede Central", "Sede Norte", "Sede Sur"]
const especialidades = ["Cardiología", "Dermatología", "Pediatría"]
const metodosPago = ["Efectivo", "Tarjeta de Crédito", "Transferencia Bancaria", "Yape", "Plin"]

const datosFormularioInicial = {
  dni: "",
  correo: "",
  telefono: "",
  sede: "",
  especialidad: "",
  doctorSeleccionado: "",
  horarioSeleccionado: "",
  sintomas: "",
  metodoPago: "",
}

// Componente principal del formulario de cita médica
export default function FormularioCitaMedica() {
  const theme = useTheme()
  const esPantallaPequena = useMediaQuery(theme.breakpoints.down("md"))

  // Estado y persistencia de paso y datos
  const [paso, setPaso] = usePersistenciaFormulario("formulario-paso", 0)
  const [datos, setDatos] = usePersistenciaFormulario("formulario-datos", datosFormularioInicial)
  const [errores, setErrores] = useState({})
  const [horarioSeleccionadoId, setHorarioSeleccionadoId] = useState("")

  // Prevenir recarga si hay datos incompletos
  const tieneInformacion = Object.values(datos).some((valor) => valor !== "")
  usePrevenirRecarga(tieneInformacion && paso < 5)

  // Horarios disponibles según sede y especialidad
  const horariosDisponibles =
    datos.sede && datos.especialidad ? horariosDoctores[datos.sede]?.[datos.especialidad] || [] : []

  // Validación de cada paso
  const validarPaso = () => {
    const nuevosErrores = {}
    if (paso === 0 && !datos.dni) nuevosErrores.dni = "Por favor, ingrese su DNI"
    if (paso === 1) {
      if (!datos.correo) nuevosErrores.correo = "Por favor, ingrese su correo electrónico"
      if (!datos.telefono) nuevosErrores.telefono = "Por favor, ingrese su número de teléfono"
    }
    if (paso === 2) {
      if (!datos.sede) nuevosErrores.sede = "Por favor, seleccione una sede"
      if (!datos.especialidad) nuevosErrores.especialidad = "Por favor, seleccione una especialidad"
    }
    if (paso === 3) {
      if (!datos.doctorSeleccionado || !datos.horarioSeleccionado)
        nuevosErrores.horario = "Por favor, seleccione un horario disponible"
      if (!datos.sintomas) nuevosErrores.sintomas = "Por favor, describa sus síntomas"
    }
    if (paso === 4 && !datos.metodoPago) nuevosErrores.metodoPago = "Por favor, seleccione un método de pago"
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Handler genérico para cambios en los campos
  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    if (name === "sede" || name === "especialidad") {
      setDatos((prev) => ({
        ...prev,
        [name]: value,
        doctorSeleccionado: "",
        horarioSeleccionado: "",
      }))
      setHorarioSeleccionadoId("")
    } else {
      setDatos({ ...datos, [name]: value })
    }
  }

  // Handler para seleccionar horario
  const manejarSeleccionHorario = (horarioId, doctor, hora) => {
    setHorarioSeleccionadoId(horarioId)
    setDatos({
      ...datos,
      doctorSeleccionado: doctor,
      horarioSeleccionado: hora,
    })
  }

  // Avanzar al siguiente paso si es válido
  const siguiente = (evento) => {
    evento.preventDefault()
    if (validarPaso()) setPaso(paso + 1)
  }

  // Retroceder al paso anterior
  const anterior = () => setPaso(paso - 1)

  // Finalizar y limpiar datos
  const finalizarFormulario = () => {
    localStorage.removeItem("formulario-datos")
    localStorage.removeItem("formulario-paso")
    alert("¡Cita registrada exitosamente! Recibirá un correo de confirmación.")
  }

  // Icono para cada paso
  const obtenerIconoPaso = (indicePaso) => pasos[indicePaso]?.icono || <Person />

  // Renderizar el paso correspondiente
  const renderPaso = () => {
    switch (paso) {
      case 0:
        return <PasoDNI datos={datos} errores={errores} manejarCambio={manejarCambio} />
      case 1:
        return <PasoInfoPersonal datos={datos} errores={errores} manejarCambio={manejarCambio} />
      case 2:
        return (
          <PasoSedeEspecialidad
            datos={datos}
            errores={errores}
            manejarCambio={manejarCambio}
            sedes={sedes}
            especialidades={especialidades}
          />
        )
      case 3:
        return (
          <PasoHorarioSintomas
            datos={datos}
            errores={errores}
            manejarCambio={manejarCambio}
            horariosDisponibles={horariosDisponibles}
            horarioSeleccionadoId={horarioSeleccionadoId}
            manejarSeleccionHorario={manejarSeleccionHorario}
          />
        )
      case 4:
        return (
          <PasoMetodoPago
            datos={datos}
            errores={errores}
            manejarCambio={manejarCambio}
            metodosPago={metodosPago}
          />
        )
      case 5:
        return <PasoResumen datos={datos} finalizarFormulario={finalizarFormulario} />
      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CssBaseline />

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 4,
        }}
      >
        <Typography variant={esPantallaPequena ? "h4" : "h3"} align="center" gutterBottom fontWeight="bold">
          🏥 Registro de Cita Médica
        </Typography>
        <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
          Complete el formulario para agendar su cita médica
        </Typography>
      </Paper>

      <Paper sx={{ p: esPantallaPequena ? 2 : 4, borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
        {/* Stepper de pasos */}
        <Stepper
          activeStep={paso}
          alternativeLabel={!esPantallaPequena}
          orientation={esPantallaPequena ? "vertical" : "horizontal"}
          sx={{ mb: 4 }}
        >
          {pasos.map((pasoInfo, indice) => (
            <Step key={pasoInfo.titulo}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: indice <= paso ? "primary.main" : "grey.300",
                      color: "white",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {obtenerIconoPaso(indice)}
                  </Box>
                )}
              >
                <Typography variant="body2" fontWeight={indice === paso ? "bold" : "normal"}>
                  {pasoInfo.titulo}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Renderizado del paso actual */}
        <Box component="form" onSubmit={siguiente}>
          {renderPaso()}

          {/* Botones de navegación */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexDirection: esPantallaPequena ? "column" : "row",
              gap: esPantallaPequena ? 2 : 0,
            }}
          >
            {paso > 0 && paso < 5 && (
              <Button
                onClick={anterior}
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                }}
              >
                ← Anterior
              </Button>
            )}
            {paso < 5 && (
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  ml: paso === 0 ? "auto" : 0,
                }}
              >
                {paso === 4 ? "Finalizar →" : "Siguiente →"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
