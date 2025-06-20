import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ErrorTexto from "./ErrorTexto";

export default function CampoSelect({
  label,
  name,
  value,
  opciones,
  error,
  onChange,
}) {
  return (
    <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} label={label} onChange={onChange}>
        {opciones.map((op) => (
          <MenuItem key={op} value={op}>
            {op}
          </MenuItem>
        ))}
      </Select>
      {error && <ErrorTexto>{error}</ErrorTexto>}
    </FormControl>
  );
}
