// Servicio para manejar las llamadas a la API de horarios
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/horarios";

// Función para mapear datos de la API al formato local (para el frontend)
const mapearDesdeAPI = (horarioAPI) => ({
  id: horarioAPI.idHorario.toString(),
  diaSemana: horarioAPI.diaSemana,
  horaInicio: horarioAPI.horaInicio,
  horaFin: horarioAPI.horaFin,
  estado: horarioAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Función para mapear datos locales al formato de la API
const mapearHaciaAPI = (horarioLocal) => ({
  diaSemana: horarioLocal.diaSemana,
  horaInicio: horarioLocal.horaInicio,
  horaFin: horarioLocal.horaFin,
  estado: horarioLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todos los horarios
export const obtenerHorarios = async () => {
  try {
    const response = await fetch(API_BASE_URL, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(mapearDesdeAPI);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica que el backend esté en línea y que permita CORS."
      );
    }
    throw error;
  }
};

// Crear nuevo horario
export const crearHorario = async (horario) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(horario)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al crear horario:", error);
    throw error;
  }
};

// Actualizar horario
export const actualizarHorario = async (id, horario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(horario)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al actualizar horario:", error);
    throw error;
  }
};
