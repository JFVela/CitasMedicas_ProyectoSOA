import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  LocationOn,
  Schedule,
  LocalHospital,
  Payment,
  Description,
  GetApp,
  Send,
} from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  border: "2px solid rgba(211, 47, 47, 0.1)",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 8,
  backgroundColor: "rgba(211, 47, 47, 0.05)",
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  marginRight: theme.spacing(2),
}));

export default function ResumenCita({
  datos,
  sedes,
  especialidades,
  metodosPago,
  onRegistrar,
  onGenerarPDF,
  cargando,
  registroExitoso = false,
  mostrarDescargaManual = false,
}) {
  const sedeSeleccionada = sedes.find((s) => s.idsede == datos.sede);
  const especialidadSeleccionada = especialidades.find(
    (e) => e.idespecialidad == datos.especialidad
  );
  const metodoPagoSeleccionado = metodosPago.find(
    (m) => m.value === datos.metodoPago
  );

  const formatearFecha = (fecha) => {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearHora = (hora) => {
    return hora?.slice(0, 5) || "";
  };

  return (
    <StyledPaper>
      <Box textAlign="center" mb={3}>
        <Typography
          variant="h5"
          color="primary.main"
          fontWeight="bold"
          gutterBottom
        >
          Resumen de su Cita Médica
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {registroExitoso
            ? "Su cita ha sido registrada exitosamente"
            : "Verifique que todos los datos sean correctos antes de confirmar"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Cambiar Grid por flexbox */}
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Primera fila de información */}
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
          <Box flex={1}>
            <InfoRow>
              <IconBox>
                <Person />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  DNI del Paciente
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {datos.dni}
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow>
              <IconBox>
                <LocationOn />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Sede
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {sedeSeleccionada?.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sedeSeleccionada?.distrito}
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow>
              <IconBox>
                <LocalHospital />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Especialidad
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {especialidadSeleccionada?.nombre}
                </Typography>
              </Box>
            </InfoRow>
          </Box>

          <Box flex={1}>
            <InfoRow>
              <IconBox>
                <Person />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Doctor
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {`${datos.disponibilidadSeleccionada?.doctor.nombres} ${datos.disponibilidadSeleccionada?.doctor.apellidos}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CMP: {datos.disponibilidadSeleccionada?.doctor.cmp}
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow>
              <IconBox>
                <Schedule />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha y Horario
                </Typography>
                <Chip
                  label={datos.disponibilidadSeleccionada?.horario.diaSemana}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {`${formatearHora(
                    datos.disponibilidadSeleccionada?.horario.horaInicio
                  )} - ${formatearHora(
                    datos.disponibilidadSeleccionada?.horario.horaFin
                  )}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatearFecha(
                    datos.disponibilidadSeleccionada?.fechaInicio
                  )}
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow>
              <IconBox>
                <Payment />
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Método de Pago
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {metodoPagoSeleccionado?.label}
                </Typography>
              </Box>
            </InfoRow>
          </Box>
        </Box>

        {/* Motivo de consulta - ancho completo */}
        <InfoRow>
          <IconBox>
            <Description />
          </IconBox>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Motivo de Consulta
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {datos.motivo}
            </Typography>
          </Box>
        </InfoRow>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Lógica de botones mejorada */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        {!registroExitoso && (
          <Button
            variant="contained"
            size="large"
            startIcon={
              cargando ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Send />
              )
            }
            onClick={onRegistrar}
            disabled={cargando}
            sx={{
              borderRadius: 25,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(211, 47, 47, 0.3)",
            }}
          >
            {cargando ? "Registrando..." : "Confirmar y Registrar Cita"}
          </Button>
        )}

        {(registroExitoso || mostrarDescargaManual) && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<GetApp />}
            onClick={onGenerarPDF}
            sx={{
              borderRadius: 25,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Descargar PDF
          </Button>
        )}
      </Box>

      {registroExitoso && (
        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="success.main" fontWeight="bold">
            ✅ Su cita médica ha sido registrada correctamente
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {mostrarDescargaManual
              ? "Use el botón superior para descargar su comprobante"
              : "Su comprobante se descargó automáticamente"}
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
}
