import { TextField, MenuItem, styled } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
}));

export default function CampoSelect({ opciones = [], error, ...props }) {
  return (
    <StyledTextField
      select
      fullWidth
      variant="outlined"
      error={!!error}
      helperText={error}
      {...props}
    >
      <MenuItem value="">
        <em>Seleccione una opción</em>
      </MenuItem>
      {opciones.map((opcion) => (
        <MenuItem key={opcion.value} value={opcion.value}>
          {opcion.label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
}
