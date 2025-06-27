// Servicio para manejar las llamadas a la API de doctores
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/doctores";

// Función para mapear datos de la API al formato local
const mapearDesdeAPI = (doctorAPI) => ({
  id: doctorAPI.idDoctor.toString(),
  nombres: doctorAPI.nombres,
  apellidos: doctorAPI.apellidos,
  dni: doctorAPI.dni,
  cmp: doctorAPI.cmp,
  correo: doctorAPI.correo,
  celular: doctorAPI.celular,
  estado: doctorAPI.estado === 1 ? "Activo" : "Inactivo",
  especialidad: {
    id: doctorAPI.especialidad?.idespecialidad?.toString() || "",
    nombre: doctorAPI.especialidad?.nombre || "",
  },
});

// Función para mapear datos locales al formato de la API
const mapearHaciaAPI = (doctorLocal) => ({
  nombres: doctorLocal.nombres,
  apellidos: doctorLocal.apellidos,
  dni: doctorLocal.dni,
  cmp: doctorLocal.cmp,
  correo: doctorLocal.correo,
  celular: doctorLocal.celular,
  estado: doctorLocal.estado === "Activo" ? 1 : 0,
  especialidad: {
    idespecialidad: parseInt(doctorLocal.especialidad.id),
  },
});

// Obtener todos los doctores
export const obtenerDoctores = async () => {
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

// Crear nuevo doctor
export const crearDoctor = async (doctor) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(doctor)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al crear doctor:", error);
    throw error;
  }
};

// Actualizar doctor
export const actualizarDoctor = async (id, doctor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(doctor)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al actualizar doctor:", error);
    throw error;
  }
};

// Eliminar doctor
export const eliminarDoctor = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar doctor:", error);
    throw error;
  }
};
