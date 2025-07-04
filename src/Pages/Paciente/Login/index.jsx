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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(4),
  backgroundColor: "rgba(255,255,255,0.95)",
  backfaceVisibility: "hidden",
}));

const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
}));

const LinkBox = styled(Box)(() => ({
  marginTop: 8,
  textAlign: "center",
}));

export default function LoginRegister() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFlip = () => setModoRegistro((prev) => !prev);

  // Usuarios hardcodeados
  const usuarios = [
    { username: "juan", password: "123456", rol: "doctor" },
    { username: "alex", password: "123456", rol: "admin" },
    { username: "maria", password: "admin123", rol: "admin" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = usuarios.find(
      (u) => u.username === usuario && u.password === password
    );

    if (user) {
      // Redirigir según el rol
      navigate(`/${user.rol}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Verifica tu usuario o contraseña",
      });
    }
  };

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

            <FormContainer component="form" onSubmit={handleLogin}>
              <TextField
                label="Usuario"
                fullWidth
                required
                autoFocus
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
              <TextField
                label="Contraseña"
                fullWidth
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* ——— REGISTRO (decorativo por ahora) ——— */}
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
