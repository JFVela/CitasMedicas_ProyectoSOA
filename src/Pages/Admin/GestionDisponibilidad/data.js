const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/disponibilidades";

// Mapear datos desde la API
const mapearDesdeAPI = (dispAPI) => ({
  id: dispAPI.idDispon.toString(),
  doctor: {
    id: dispAPI.doctor?.idDoctor?.toString() || "",
    nombre: `${dispAPI.doctor?.nombres || ""} ${dispAPI.doctor?.apellidos || ""}`,
  },
  sede: {
    id: dispAPI.sede?.idsede?.toString() || "",
    nombre: dispAPI.sede?.nombre || "",
  },
  horario: {
    id: dispAPI.horario?.idHorario?.toString() || "",
    nombre: `${dispAPI.horario?.diaSemana} ${dispAPI.horario?.horaInicio?.slice(0, 5)} - ${dispAPI.horario?.horaFin?.slice(0, 5)}`
  },
  fechaInicio: dispAPI.fechaInicio,
  fechaFin: dispAPI.fechaFin,
  estado: dispAPI.estado === 1 ? "Activo" : "Inactivo"
});

// Mapear datos al formato de la API
const mapearHaciaAPI = (dispLocal) => ({
  doctor: { idDoctor: parseInt(dispLocal.doctor.id) },
  sede: { idsede: parseInt(dispLocal.sede.id) },
  horario: { idHorario: parseInt(dispLocal.horario.id) },
  fechaInicio: dispLocal.fechaInicio,
  fechaFin: dispLocal.fechaFin,
  estado: dispLocal.estado === "Activo" ? 1 : 0
});

// Obtener todas las disponibilidades
export const obtenerDisponibilidades = async () => {
  try {
    const response = await fetch(API_BASE_URL, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(mapearDesdeAPI);
  } catch (error) {
    console.error("Error al obtener disponibilidades:", error);
    throw error;
  }
};

// Crear nueva disponibilidad
export const crearDisponibilidad = async (disponibilidad) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mapearHaciaAPI(disponibilidad)),
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al crear disponibilidad:", error);
    throw error;
  }
};

// Editar disponibilidad existente
export const editarDisponibilidad = async (id, disponibilidad) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mapearHaciaAPI(disponibilidad)),
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al editar disponibilidad:", error);
    throw error;
  }
};

// Eliminar disponibilidad
export const eliminarDisponibilidad = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      mode: "cors"
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar disponibilidad:", error);
    throw error;
  }
};
