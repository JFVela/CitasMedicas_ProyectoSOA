import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Typography,
  Box,
  Paper,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const theme = createTheme();

// Paper con estilos comunes
const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(4),
  backgroundColor: "rgba(255,255,255,0.95)",
  backfaceVisibility: "hidden",
}));

// Form container: columna, items centrados y gap uniforme
const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
}));

// Footer link centrado
const LinkBox = styled(Box)(() => ({
  marginTop: 8,
  textAlign: "center",
}));

export default function LoginRegister() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const handleFlip = () => setModoRegistro((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ perspective: "1000px", mt: 10 }}
      >
        <Box
          sx={{
            width: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.8s",
            transform: modoRegistro ? "rotateY(180deg)" : "none",
          }}
        >
          {/* ——— LOGIN ——— */}
          <StyledPaper elevation={6}>
            <Box textAlign="center">
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5">Iniciar Sesión</Typography>
            </Box>

            <FormContainer component="form">
              <TextField
                label="Usuario"
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Contraseña"
                fullWidth
                required
                type="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
              >
                Ingresar
              </Button>
            </FormContainer>

            <LinkBox>
              <Link
                component="button"
                onClick={handleFlip}
                variant="body2"
              >
                ¿No tienes una cuenta? Crear cuenta
              </Link>
            </LinkBox>
          </StyledPaper>

          {/* ——— REGISTRO ——— */}
          <StyledPaper
            elevation={6}
            sx={{ transform: "rotateY(180deg)" }}
          >
            <Box textAlign="center">
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5">Crear Cuenta</Typography>
            </Box>

            <FormContainer component="form">
              <TextField label="DNI" fullWidth required />
              <TextField label="Usuario" fullWidth required />
              <TextField
                label="Contraseña"
                fullWidth
                required
                type="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ py: 1.5 }}
              >
                Registrarse
              </Button>
            </FormContainer>

            <LinkBox>
              <Link
                component="button"
                onClick={handleFlip}
                variant="body2"
              >
                ¿Ya tienes cuenta? Iniciar sesión
              </Link>
            </LinkBox>
          </StyledPaper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
