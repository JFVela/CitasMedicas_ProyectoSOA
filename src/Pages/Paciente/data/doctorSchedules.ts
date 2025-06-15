import type { DoctorSchedule } from "../types/form"

export const doctorSchedules: Record<string, Record<string, DoctorSchedule[]>> = {
  "Sede Central": {
    Cardiología: [
      { id: "1", doctor: "Dr. Juan Pérez", hora: "08:00", estado: "libre" },
      { id: "2", doctor: "Dr. Juan Pérez", hora: "09:00", estado: "reservado" },
      { id: "3", doctor: "Dra. María López", hora: "10:00", estado: "libre" },
      { id: "4", doctor: "Dra. María López", hora: "11:00", estado: "libre" },
    ],
    Dermatología: [
      { id: "5", doctor: "Dr. Carlos Ruiz", hora: "08:00", estado: "libre" },
      { id: "6", doctor: "Dr. Carlos Ruiz", hora: "09:00", estado: "libre" },
      { id: "7", doctor: "Dra. Ana García", hora: "10:00", estado: "reservado" },
      { id: "8", doctor: "Dra. Ana García", hora: "11:00", estado: "libre" },
    ],
    Pediatría: [
      { id: "9", doctor: "Dr. Roberto Silva", hora: "08:00", estado: "libre" },
      { id: "10", doctor: "Dr. Roberto Silva", hora: "09:00", estado: "libre" },
      { id: "11", doctor: "Dra. Carmen Díaz", hora: "10:00", estado: "libre" },
      { id: "12", doctor: "Dra. Carmen Díaz", hora: "11:00", estado: "reservado" },
    ],
  },
  "Sede Norte": {
    Cardiología: [
      { id: "13", doctor: "Dr. Luis Mendoza", hora: "08:00", estado: "libre" },
      { id: "14", doctor: "Dr. Luis Mendoza", hora: "09:00", estado: "libre" },
      { id: "15", doctor: "Dra. Patricia Vega", hora: "10:00", estado: "reservado" },
      { id: "16", doctor: "Dra. Patricia Vega", hora: "11:00", estado: "libre" },
    ],
    Dermatología: [
      { id: "17", doctor: "Dr. Fernando Torres", hora: "08:00", estado: "libre" },
      { id: "18", doctor: "Dr. Fernando Torres", hora: "09:00", estado: "libre" },
      { id: "19", doctor: "Dra. Sofía Morales", hora: "10:00", estado: "libre" },
      { id: "20", doctor: "Dra. Sofía Morales", hora: "11:00", estado: "libre" },
    ],
    Pediatría: [
      { id: "21", doctor: "Dr. Miguel Ángel", hora: "08:00", estado: "reservado" },
      { id: "22", doctor: "Dr. Miguel Ángel", hora: "09:00", estado: "libre" },
      { id: "23", doctor: "Dra. Elena Castillo", hora: "10:00", estado: "libre" },
      { id: "24", doctor: "Dra. Elena Castillo", hora: "11:00", estado: "libre" },
    ],
  },
  "Sede Sur": {
    Cardiología: [
      { id: "25", doctor: "Dr. Andrés Herrera", hora: "08:00", estado: "libre" },
      { id: "26", doctor: "Dr. Andrés Herrera", hora: "09:00", estado: "libre" },
      { id: "27", doctor: "Dra. Lucía Ramírez", hora: "10:00", estado: "libre" },
      { id: "28", doctor: "Dra. Lucía Ramírez", hora: "11:00", estado: "reservado" },
    ],
    Dermatología: [
      { id: "29", doctor: "Dr. Javier Ortiz", hora: "08:00", estado: "libre" },
      { id: "30", doctor: "Dr. Javier Ortiz", hora: "09:00", estado: "reservado" },
      { id: "31", doctor: "Dra. Valeria Núñez", hora: "10:00", estado: "libre" },
      { id: "32", doctor: "Dra. Valeria Núñez", hora: "11:00", estado: "libre" },
    ],
    Pediatría: [
      { id: "33", doctor: "Dr. Diego Paredes", hora: "08:00", estado: "libre" },
      { id: "34", doctor: "Dr. Diego Paredes", hora: "09:00", estado: "libre" },
      { id: "35", doctor: "Dra. Mónica Flores", hora: "10:00", estado: "libre" },
      { id: "36", doctor: "Dra. Mónica Flores", hora: "11:00", estado: "libre" },
    ],
  },
}
