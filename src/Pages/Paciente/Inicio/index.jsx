import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import {
  Check,
  Heart,
  Award,
  ListOrdered,
  Handshake,
  Scale,
  Users,
} from "lucide-react"; // Importar iconos de Lucide React

// Define el tema con los colores rojo y blanco
const theme = createTheme({
  palette: {
    primary: {
      main: "#D32F2F", // Un rojo fuerte
    },
    secondary: {
      main: "#FFFFFF", // Blanco
    },
    text: {
      primary: "#333333", // Gris oscuro para legibilidad
      secondary: "#666666",
    },
    background: {
      default: "#F5F5F5", // Fondo gris claro
      paper: "#FFFFFF",
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#FFFFFF",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#D32F2F",
      marginBottom: "1rem",
      "@media (max-width:600px)": {
        fontSize: "1.8rem",
      },
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#D32F2F",
      marginBottom: "0.8rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: "#333333",
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
  },
});

// Componentes estilizados para las secciones
const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4, 0),
  },
}));

const HeroSection = styled(Section)(({ theme }) => ({
  position: "relative",
  height: "50vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: theme.palette.secondary.main,
  backgroundImage:
    "url('https://cdn.www.gob.pe/uploads/document/file/7800916/1129083-52-anos-del-sj-foto-2.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  animation: "fadeIn 1.5s ease-in-out",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const HeroContent = styled(Box)({
  position: "relative",
  zIndex: 1,
  maxWidth: "800px",
  padding: "0 20px",
});

const ValueItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  width: "calc(33% - 24px)",
  [theme.breakpoints.down("md")]: {
    width: "calc(50% - 16px)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  padding: theme.spacing(3),
  borderRadius: "20px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 8px 32px rgba(211, 47, 47, 0.1)",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 16px 48px rgba(211, 47, 47, 0.2)",
  },
}));

const ValueLetter = styled(Typography)(({ theme }) => ({
  fontSize: "4rem",
  fontWeight: 900,
  background: "linear-gradient(45deg, #D32F2F 30%, #FF6B6B 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textShadow: "0 4px 8px rgba(211, 47, 47, 0.3)",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  transition: "all 0.3s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    fontSize: "3rem",
  },
}));

const CardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.15)",
  },
}));

const ValuesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const AnimatedSection = styled(Section)(({ theme }) => ({
  animation: "slideInUp 0.8s ease-out",
  "@keyframes slideInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(50px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const MissionVisionSection = styled(Section)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* Sección Hero */}
        <HeroSection>
          <HeroContent>
            <Typography variant="h1" component="h1" gutterBottom>
              Hospital San José
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4 }}>
              Atención médica integral y especializada para la región Callao.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                color: "white",
                padding: "12px 32px",
                fontSize: "1.1rem",
                borderRadius: "50px",
                background: "linear-gradient(45deg, #D32F2F 30%, #FF6B6B 90%)",
                boxShadow: "0 8px 32px rgba(211, 47, 47, 0.3)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(211, 47, 47, 0.4)",
                },
              }}
            >
              Conoce Más
            </Button>
          </HeroContent>
        </HeroSection>

        {/* Sección Sobre Nosotros - ¿Qué hacemos? */}
        <AnimatedSection
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h2" align="center" gutterBottom>
              ¿Qué hacemos?
            </Typography>
            <Typography variant="body1" paragraph>
              Somos un hospital de referencia en la región Callao, reconocido
              por brindar atención médica integral y especializada de mediana
              complejidad, tanto en emergencias y urgencias como en
              procedimientos quirúrgicos. Somos un hospital nivel II-2,
              ofrecemos una amplia gama de servicios, desde la prevención y la
              promoción de la salud hasta la rehabilitación y la gestión de
              riesgos.
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestro compromiso con la excelencia nos impulsa a superar las
              expectativas de nuestros pacientes, brindando atención cálida y
              eficiente, y convertirnos en un referente a nivel nacional.
            </Typography>
          </Container>
        </AnimatedSection>

        {/* Sección Misión y Visión */}
        <MissionVisionSection>
          <Container maxWidth="md">
            <CardContainer>
              <StyledCard>
                <CardContent>
                  <Typography variant="h3" component="h3" gutterBottom>
                    Misión
                  </Typography>
                  <Typography variant="body1">
                    Somos un Hospital del Gobierno Regional del Callao que
                    brinda atenciones Integradas de salud especializadas
                    contribuyendo a mejorar la calidad de vida al individuo, su
                    familia y comunidad; mediante la prestación de servicios con
                    calidad y eficiencia.
                  </Typography>
                </CardContent>
              </StyledCard>
              <StyledCard>
                <CardContent>
                  <Typography variant="h3" component="h3" gutterBottom>
                    Visión
                  </Typography>
                  <Typography variant="body1">
                    En los próximos 5 años, el Hospital San José, será una
                    organización exitosa y competitiva que contribuya a tener
                    una población sana, con fácil acceso al establecimiento, con
                    servicios eficientes y equitativos, con personal
                    comprometido en una cultura organizacional de calidad y
                    calidez.
                  </Typography>
                </CardContent>
              </StyledCard>
            </CardContainer>
          </Container>
        </MissionVisionSection>

        {/* Sección Valores */}
        <AnimatedSection
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h2" align="center" gutterBottom>
              Nuestros Valores
            </Typography>
            <ValuesContainer>
              {[
                {
                  letter: "V",
                  value: "erdad",
                  icon: <Check size={40} color={theme.palette.primary.main} />,
                },
                {
                  letter: "A",
                  value: "mor",
                  icon: <Heart size={40} color={theme.palette.primary.main} />,
                },
                {
                  letter: "L",
                  value: "iderazgo",
                  icon: <Award size={40} color={theme.palette.primary.main} />,
                },
                {
                  letter: "O",
                  value: "rden",
                  icon: (
                    <ListOrdered size={40} color={theme.palette.primary.main} />
                  ),
                },
                {
                  letter: "R",
                  value: "espeto",
                  icon: (
                    <Handshake size={40} color={theme.palette.primary.main} />
                  ),
                },
                {
                  letter: "E",
                  value: "quidad",
                  icon: <Scale size={40} color={theme.palette.primary.main} />,
                },
                {
                  letter: "S",
                  value: "olidaridad",
                  icon: <Users size={40} color={theme.palette.primary.main} />,
                },
              ].map((item, index) => (
                <ValueItem key={index}>
                  {item.icon}
                  <ValueLetter variant="h1" component="span">
                    {item.letter}
                  </ValueLetter>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {item.value}
                  </Typography>
                </ValueItem>
              ))}
            </ValuesContainer>
          </Container>
        </AnimatedSection>

        {/* Sección Historia */}
        <AnimatedSection
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h2" align="center" gutterBottom>
              Reseña Histórica
            </Typography>
            <Typography variant="body1" paragraph>
              El Hospital de Apoyo San José-Callao, fue creado en junio de 1970
              con apoyo de la Fundación Inglesa “St. Joseph’s Hospice
              Association”. A consecuencia del terremoto ocurrido el 31 de mayo
              del mismo año. En 1973 fue transferido al MINSA y Administrado por
              el Hospital Nacional Daniel Alcides Carrión. Inicialmente funcionó
              como Hospital Materno Infantil. (Personal de nacionalidad inglesa
              y personal peruano).
            </Typography>
            <Typography variant="body1" paragraph>
              Según oficio SA-OGP-OEPRE Nº 980-95 de fecha 07 de Julio de 1995,
              se pone en conocimiento de la Dirección Subregional de Salud I -
              Callao, que a partir del Ejercicio Fiscal 1996 el AIS HOSPITAL SAN
              JOSÉ-CALLAO, pasará a integrar el nuevo Sub-Programa 06.004 AIS
              HOSPITAL SAN JOSE- CALLAO, dentro de la Jurisdicción de la
              Subregión de Salud I - Callao. El mismo que fue puesto a
              conocimiento de la Dirección del HOSPITAL DE APOYO SAN JOSE -
              CALLAO según Oficio SA-OGP-OEPRE-981-95 de fecha 07 de julio de
              1995.
            </Typography>
            <Typography variant="body1" paragraph>
              En 1996 logra constituirse como Unidad Ejecutora Presupuestal en
              la Provincia Constitucional del Callao, con el Apoyo del
              Ministerio de la Presidencia; mejora su equipamiento, amplía los
              servicios y programas de atención, se fortalece su Sistema
              Administrativo y evolución del proceso de Comunicación e
              Informática. Según R.V.M. Nº 111-96-SA-OGA de fecha 08 de enero de
              1996 y R.V.M. Nº 044-96-SA-OGA de fecha 19 de enero de 1996, se
              autoriza como Oficina Giradora al Sub-Programa 004 AIS HOSPITAL
              SAN JOSE-CALLAO en el manejo de la Sub-Cuenta de Gastos OTROS
              TESORO PUBLICO y Sub Cuenta Bancaria TESORO PUBLICO, a través del
              Banco de la Nación, para el Financiamiento de los Pagos de
              Compromisos (Gastos), Ejecutados según las Asignaciones Genéricas
              01.00 Remuneraciones, 02.00 Bienes, 03.00 Servicios, 04.00
              Transferencias Corrientes, 14.00 Bienes de Capital No Ligados a
              Proyectos de Inversión, para el Ejercicio Fiscal 1996. Por
              consiguiente el HOSPITAL SAN JOSE - CALLAO, en la Estructura
              Funcional Programática Presupuestal del Ejercicio Fiscal 1996, se
              constituyó en el Sub-Programa 06.004 HOSPITAL SAN JOSE - CALLAO,
              contando para dicho año con Autonomía Presupuestaria y Financiera,
              para la satisfacción de nuestras necesidades, y el cumplimiento de
              las metas, de las diferentes Unidades Orgánicas que constituye
              nuestra Institución, en beneficio de la Comunidad.
            </Typography>
            <Typography variant="body1" paragraph>
              En 1997 es reconocido como “Hospital Amigo de la Madre y el niño”.
              Y en 1999 el Programa Materno Perinatal del MINSA reconoce como
              Hospital que cumple “Diez Pasos para un Parto Seguro”. En
              diciembre del año 2001 es designado como piloto para el Sistema de
              Gestión de la Calidad. Y en el año 2012, es considerado como
              piloto para el sistema de costos hospitalarios, por el Ministerio
              de Economía y Finanzas. En julio del 2014 logra un merecido
              reconocimiento a nivel nacional por la certificación obtenida por
              su participación en el Concurso Anual “Premio a la Buenas
              Practicas -2014”, organizado por la Organización Civil “Ciudadanos
              al Día” el CAD.
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 4, fontStyle: "italic", color: "text.secondary" }}
            >
              (Fuente: Plan Operativo 2016 del Hospital San José. Generalidades)
            </Typography>
          </Container>
        </AnimatedSection>

        {/* Descargo de responsabilidad */}
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="caption">
            Este diseño de página es un proyecto de curso de SOA y no tiene la
            intención de sustituir, engañar o cometer fraude con la entidad real
            del Hospital San José. Es puramente para fines de demostración de
            diseño y desarrollo.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
