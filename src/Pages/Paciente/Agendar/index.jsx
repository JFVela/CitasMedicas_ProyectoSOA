import { useState, useEffect } from "react";
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
  ThemeProvider,
  createTheme,
} from "@mui/material";
import BotonAccion from "./Components/BotonAccion";
import CampoTexto from "./Components/CampoTexto";
import CampoSelect from "./Components/CampoSelect";
import TablaDisponibilidades from "./Components/TablaHorarios";
import ResumenCita from "./Components/ResumenCita";
import {
  obtenerSedes,
  obtenerEspecialidades,
  obtenerDisponibilidadesFiltradas,
  registrarCita,
} from "./data";

// Tema personalizado con colores rojo y blanco
const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f",
      light: "#ff6659",
      dark: "#9a0007",
    },
    secondary: {
      main: "#ffffff",
      dark: "#f5f5f5",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root.Mui-active": {
            color: "#d32f2f",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#d32f2f",
          },
        },
      },
    },
  },
});

const PaperForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(211, 47, 47, 0.1)",
  border: "1px solid rgba(211, 47, 47, 0.1)",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #d32f2f 0%, #ff6659 100%)",
  color: "white",
  padding: theme.spacing(3),
  borderRadius: "16px 16px 0 0",
  marginTop: -theme.spacing(4),
  marginLeft: -theme.spacing(4),
  marginRight: -theme.spacing(4),
  marginBottom: theme.spacing(3),
}));

const pasos = [
  "DNI del Paciente",
  "Sede y Especialidad",
  "Seleccionar Disponibilidad",
  "Motivo de Consulta",
  "Método de Pago",
  "Resumen y Confirmación",
];

const metodosPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta de Crédito/Débito" },
  { value: "transferencia", label: "Transferencia Bancaria" },
];

export default function FormularioPaciente() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({
    dni: "",
    sede: "",
    especialidad: "",
    disponibilidadSeleccionada: null,
    motivo: "",
    metodoPago: "",
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [mostrarDescargaManual, setMostrarDescargaManual] = useState(false);

  // Estados para datos de la API
  const [sedes, setSedes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);

  // Cargar sedes y especialidades al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [sedesData, especialidadesData] = await Promise.all([
          obtenerSedes(),
          obtenerEspecialidades(),
        ]);
        setSedes(sedesData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        mostrarAlerta("Error al cargar datos iniciales", "error");
      }
    };
    cargarDatosIniciales();
  }, []);

  // Cargar disponibilidades cuando se selecciona sede y especialidad
  useEffect(() => {
    // Limpiar la selección anterior cuando cambian sede o especialidad
    setDatos((prev) => ({ ...prev, disponibilidadSeleccionada: null }));

    if (datos.sede && datos.especialidad) {
      const cargarDisponibilidades = async () => {
        try {
          setCargando(true);
          const disponibilidadesData = await obtenerDisponibilidadesFiltradas(
            Number(datos.sede),
            Number(datos.especialidad)
          );
          setDisponibilidades(disponibilidadesData);
        } catch (error) {
          mostrarAlerta("Error al cargar disponibilidades", "error");
          setDisponibilidades([]);
        } finally {
          setCargando(false);
        }
      };
      cargarDisponibilidades();
    } else {
      setDisponibilidades([]);
    }
  }, [datos.sede, datos.especialidad]);

  const mostrarAlerta = (message, type = "success") => {
    setAlerta({ show: true, message, type });
    setTimeout(
      () => setAlerta({ show: false, message: "", type: "success" }),
      4000
    );
  };

  const validarPaso = () => {
    const nuevosErrores = {};

    switch (paso) {
      case 0: // DNI
        if (!datos.dni) {
          nuevosErrores.dni = "El DNI es obligatorio";
        } else if (!/^\d{8}$/.test(datos.dni)) {
          nuevosErrores.dni = "El DNI debe tener 8 dígitos";
        }
        break;

      case 1: // Sede y Especialidad
        if (!datos.sede) nuevosErrores.sede = "Seleccione una sede";
        if (!datos.especialidad)
          nuevosErrores.especialidad = "Seleccione una especialidad";
        break;

      case 2: // Disponibilidad
        if (!datos.disponibilidadSeleccionada) {
          nuevosErrores.disponibilidad = "Seleccione una disponibilidad";
        }
        break;

      case 3: // Motivo
        if (!datos.motivo) {
          nuevosErrores.motivo = "El motivo de consulta es obligatorio";
        } else if (datos.motivo.length < 10) {
          nuevosErrores.motivo = "El motivo debe tener al menos 10 caracteres";
        }
        break;

      case 4: // Método de pago
        if (!datos.metodoPago)
          nuevosErrores.metodoPago = "Seleccione un método de pago";
        break;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const seleccionarDisponibilidad = (disponibilidad) => {
    setDatos((prev) => ({
      ...prev,
      disponibilidadSeleccionada: disponibilidad,
    }));
    if (errores.disponibilidad) {
      setErrores((prev) => ({ ...prev, disponibilidad: undefined }));
    }
  };

  const handleNext = () => {
    if (validarPaso()) {
      setPaso((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setPaso((prev) => prev - 1);
  };

  const registrarCitaFinal = async () => {
    try {
      setCargando(true);
      const mensaje = await registrarCita({
        dni: datos.dni,
        idDisponibilidad: datos.disponibilidadSeleccionada.idDispon,
        motivo: datos.motivo,
      });

      setRegistroExitoso(true);
      mostrarAlerta("¡Cita registrada exitosamente!", "success");

      // Intentar generar y descargar PDF automáticamente
      setTimeout(async () => {
        try {
          await generarPDF();
          mostrarAlerta("PDF descargado automáticamente", "success");
        } catch (error) {
          console.error("Error en descarga automática:", error);
          setMostrarDescargaManual(true);
          mostrarAlerta(
            "Registro exitoso. Use el botón para descargar el PDF manualmente.",
            "warning"
          );
        }
      }, 1000);
    } catch (error) {
      mostrarAlerta("Error al registrar la cita", "error");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const generarPDF = async () => {
    try {
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 120], // Formato pequeño tipo ticket
      });

      // Configurar fuente
      doc.setFont("helvetica");

      // Header
      doc.setFillColor(211, 47, 47);
      doc.rect(0, 0, 80, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("CITA MÉDICA", 40, 12, { align: "center" });

      // Contenido
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      let y = 30;

      doc.text("DNI:", 5, y);
      doc.text(datos.dni, 25, y);
      y += 8;

      doc.text("Sede:", 5, y);
      doc.text(sedes.find((s) => s.idsede == datos.sede)?.nombre || "", 25, y);
      y += 8;

      doc.text("Especialidad:", 5, y);
      doc.text(
        especialidades.find((e) => e.idespecialidad == datos.especialidad)
          ?.nombre || "",
        25,
        y
      );
      y += 8;

      doc.text("Doctor:", 5, y);
      doc.text(
        `${datos.disponibilidadSeleccionada?.doctor.nombres} ${datos.disponibilidadSeleccionada?.doctor.apellidos}`,
        25,
        y
      );
      y += 8;

      doc.text("Fecha:", 5, y);
      doc.text(
        new Date(
          datos.disponibilidadSeleccionada?.fechaInicio
        ).toLocaleDateString("es-ES"),
        25,
        y
      );
      y += 8;

      doc.text("Horario:", 5, y);
      doc.text(
        `${datos.disponibilidadSeleccionada?.horario.diaSemana} ${datos.disponibilidadSeleccionada?.horario.horaInicio}`,
        25,
        y
      );
      y += 8;

      doc.text("Pago:", 5, y);
      doc.text(
        metodosPago.find((m) => m.value === datos.metodoPago)?.label || "",
        25,
        y
      );
      y += 12;

      doc.text("Motivo:", 5, y);
      const motivoLines = doc.splitTextToSize(datos.motivo, 70);
      doc.text(motivoLines, 5, y + 5);

      // Footer
      y = 110;
      doc.setFontSize(6);
      doc.text("Generado: " + new Date().toLocaleString("es-ES"), 40, y, {
        align: "center",
      });

      // Descargar
      doc.save(`cita-medica-${datos.dni}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      mostrarAlerta("Error al generar el PDF", "error");
    }
  };

  const renderFormularioPaso = (paso) => {
    switch (paso) {
      case 0:
        return (
          <CampoTexto
            label="DNI del Paciente"
            name="dni"
            value={datos.dni}
            error={errores.dni}
            onChange={manejarCambio}
            placeholder="Ingrese su DNI (8 dígitos)"
            autoFocus
          />
        );

      case 1:
        return (
          <>
            <CampoSelect
              label="Sede"
              name="sede"
              value={datos.sede}
              opciones={sedes.map((s) => ({
                value: s.idsede,
                label: s.nombre,
              }))}
              error={errores.sede}
              onChange={manejarCambio}
            />
            <CampoSelect
              label="Especialidad"
              name="especialidad"
              value={datos.especialidad}
              opciones={especialidades.map((e) => ({
                value: e.idespecialidad,
                label: e.nombre,
              }))}
              error={errores.especialidad}
              onChange={manejarCambio}
            />
          </>
        );

      case 2:
        return (
          <>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}
            >
              Seleccione una disponibilidad
            </Typography>
            {errores.disponibilidad && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errores.disponibilidad}
              </Alert>
            )}
            <TablaDisponibilidades
              disponibilidades={disponibilidades}
              disponibilidadSeleccionada={datos.disponibilidadSeleccionada}
              onSeleccionar={seleccionarDisponibilidad}
              cargando={cargando}
            />
          </>
        );

      case 3:
        return (
          <CampoTexto
            label="Motivo de Consulta"
            name="motivo"
            value={datos.motivo}
            error={errores.motivo}
            onChange={manejarCambio}
            multiline
            minRows={4}
            placeholder="Describa detalladamente el motivo de su consulta médica..."
          />
        );

      case 4:
        return (
          <CampoSelect
            label="Método de Pago"
            name="metodoPago"
            value={datos.metodoPago}
            opciones={metodosPago}
            error={errores.metodoPago}
            onChange={manejarCambio}
          />
        );

      case 5:
        return (
          <ResumenCita
            datos={datos}
            sedes={sedes}
            especialidades={especialidades}
            metodosPago={metodosPago}
            onRegistrar={registrarCitaFinal}
            onGenerarPDF={generarPDF}
            cargando={cargando}
            registroExitoso={registroExitoso}
            mostrarDescargaManual={mostrarDescargaManual}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <CssBaseline />
        <PaperForm>
          <HeaderBox>
            <Typography variant="h4" align="center" fontWeight="bold">
              Registro de Cita Médica
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ opacity: 0.9, mt: 1 }}
            >
              Complete los siguientes pasos para agendar su cita
            </Typography>
          </HeaderBox>

          {alerta.show && (
            <Alert severity={alerta.type} sx={{ mb: 3 }}>
              {alerta.message}
            </Alert>
          )}

          <Stepper activeStep={paso} orientation="vertical">
            {pasos.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="h6" color="primary.main">
                    {label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box component="form" noValidate autoComplete="off">
                    {renderFormularioPaso(index)}
                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      {index > 0 && (
                        <BotonAccion
                          onClick={handleBack}
                          variant="outlined"
                          disabled={cargando}
                        >
                          Anterior
                        </BotonAccion>
                      )}
                      {index < pasos.length - 1 && (
                        <BotonAccion
                          variant="contained"
                          onClick={handleNext}
                          disabled={cargando}
                        >
                          {index === pasos.length - 2
                            ? "Finalizar"
                            : "Siguiente"}
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
    </ThemeProvider>
  );
}
