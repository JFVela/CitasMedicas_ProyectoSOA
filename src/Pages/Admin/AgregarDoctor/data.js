// Lista de especialidades disponibles
export const especialidades = [
  { id: "101", nombre: "Cardiología" },
  { id: "102", nombre: "Neurología" },
  { id: "103", nombre: "Pediatría" },
  { id: "104", nombre: "Ginecología" },
  { id: "105", nombre: "Traumatología" },
  { id: "106", nombre: "Dermatología" },
]

export const doctoresIniciales = [
  {
    id: "1",
    idEspecialidad: "101",
    especialidad: "Cardiología",
    nombre: "Luis",
    apellido: "Salazar Torres",
    dni: "12345678",
    cmp: "CMP001",
    correo: "luis.salazar@hospital.com",
    celular: "9876543201",
    estado: 1,
  },
  {
    id: "2",
    idEspecialidad: "102",
    especialidad: "Neurología",
    nombre: "María",
    apellido: "González Pérez",
    dni: "87654321",
    cmp: "CMP002",
    correo: "maria.gonzalez@hospital.com",
    celular: "9876543202",
    estado: 1,
  },
]
