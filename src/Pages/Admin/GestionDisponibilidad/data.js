// Doctores (similares al ejemplo)
export const doctores = [
  { id: "1", nombre: "Luis Salazar Torres" },
  { id: "2", nombre: "María González Pérez" },
];

// Sedes del hospital
export const sedes = [
  { id: "s1", nombre: "Sede Central" },
  { id: "s2", nombre: "Sede Surco" },
  { id: "s3", nombre: "Sede San Juan" },
];

// Horarios disponibles (ejemplo básico)
export const horarios = [
  { id: "h1", dia_semana: "Lunes" },
  { id: "h2", dia_semana: "Martes" },
  { id: "h3", dia_semana: "Miércoles" },
  { id: "h4", dia_semana: "Jueves" },
  { id: "h5", dia_semana: "Viernes" },
];

// Disponibilidades
export const disponibilidadInicial = [
  {
    idDisponibilidad: "d1",
    id_doctor: "1",
    id_sede: "s1",
    id_horario: "h1",
    fecha_inicio: "2025-06-24",
    fecha_fin: "2025-06-28",
    estado: 1,
  },
  {
    idDisponibilidad: "d2",
    id_doctor: "2",
    id_sede: "s2",
    id_horario: "h3",
    fecha_inicio: "2025-06-25",
    fecha_fin: "2025-07-01",
    estado: 1,
  },
  {
    idDisponibilidad: "d3",
    id_doctor: "1",
    id_sede: "s3",
    id_horario: "h5",
    fecha_inicio: "2025-07-01",
    fecha_fin: "2025-07-05",
    estado: 0,
  },
];
