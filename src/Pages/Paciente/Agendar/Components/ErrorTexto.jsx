import { Typography } from "@mui/material";

export default function ErrorTexto({ children }) {
  return (
    <Typography color="error" fontSize="0.75rem" mt={2}>
      {children}
    </Typography>
  );
}
