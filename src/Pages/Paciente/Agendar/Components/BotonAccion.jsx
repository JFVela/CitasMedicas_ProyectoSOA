import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 25,
  padding: "12px 24px",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1rem",
  boxShadow:
    variant === "contained" ? "0 4px 15px rgba(211, 47, 47, 0.3)" : "none",
  "&:hover": {
    boxShadow:
      variant === "contained" ? "0 6px 20px rgba(211, 47, 47, 0.4)" : "none",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

export default function BotonAccion({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
