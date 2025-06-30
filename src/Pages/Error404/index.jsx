import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Container = styled(Box)(({ theme }) => ({
  minHeight: "70vh",
  background: "linear-gradient(to bottom right, #fff, #f8d7da)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(4),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#dc3545",
  color: "#fff",
  padding: theme.spacing(2.5),
  borderRadius: "50%",
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem",
  fontWeight: 700,
  color: "#dc3545",
  marginBottom: theme.spacing(1),
  textAlign: "center",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  color: "#6c757d",
  textAlign: "center",
  maxWidth: 500,
  marginBottom: theme.spacing(4),
}));

export default function Error404() {
  return (
    <Container>
      <IconWrapper>
        <ReportProblemIcon style={{ fontSize: 48 }} />
      </IconWrapper>

      <Title>404 - Página no encontrada</Title>

      <Subtitle>
        Lo sentimos, la página que estás buscando no existe o fue movida. Por
        favor, vuelve al inicio para continuar navegando en nuestro sistema
        hospitalario.
      </Subtitle>
    </Container>
  );
}
