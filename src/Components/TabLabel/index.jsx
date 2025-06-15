import { Box, Typography } from "@mui/material";

function TabLabel({ icon, label, selected }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {icon}
      <Typography
        variant="body2"
        sx={{
          fontWeight: selected ? 700 : 500,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default TabLabel;
