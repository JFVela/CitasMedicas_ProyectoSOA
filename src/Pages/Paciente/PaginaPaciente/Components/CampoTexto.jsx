import { Box, TextField } from "@mui/material";

export default function CampoTexto({
  label,
  name,
  value,
  error,
  onChange,
  ...rest
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        fullWidth
        error={!!error}
        helperText={error}
        {...rest}
      />
    </Box>
  );
}
