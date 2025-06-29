import { TextField, styled } from "@mui/material";

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

export default function CampoTexto({ error, ...props }) {
  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      error={!!error}
      helperText={error}
      {...props}
    />
  );
}
