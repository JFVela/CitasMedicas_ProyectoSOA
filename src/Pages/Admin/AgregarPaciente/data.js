// Servicio para manejar las llamadas a la API de pacientes
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/pacientes";

// Función para mapear datos de la API al formato local
const mapearDesdeAPI = (pacienteAPI) => ({
  id: pacienteAPI.idpaciente.toString(),
  nombres: pacienteAPI.nombres,
  apellidos: pacienteAPI.apellidos,
  dni: pacienteAPI.dni,
  correo: pacienteAPI.correo,
  celular: pacienteAPI.celular,
  direccion: pacienteAPI.direccion,
  fechaNacimiento: pacienteAPI.fechaNacimiento, // formato ISO string (yyyy-MM-dd)
  sexo: pacienteAPI.sexo,
  estado: pacienteAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Función para mapear datos locales al formato de la API
const mapearHaciaAPI = (pacienteLocal) => ({
  nombres: pacienteLocal.nombres,
  apellidos: pacienteLocal.apellidos,
  dni: pacienteLocal.dni,
  correo: pacienteLocal.correo,
  celular: pacienteLocal.celular,
  direccion: pacienteLocal.direccion,
  fechaNacimiento: pacienteLocal.fechaNacimiento, // formato "yyyy-MM-dd"
  sexo: pacienteLocal.sexo,
  estado: pacienteLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todos los pacientes
export const obtenerPacientes = async () => {
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

// Crear nuevo paciente
export const crearPaciente = async (paciente) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(paciente)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al crear paciente:", error);
    throw error;
  }
};

// Actualizar paciente
export const actualizarPaciente = async (id, paciente) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(paciente)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    throw error;
  }
};

/*
// Eliminar paciente — NO USAR por reglas de negocio
export const eliminarPaciente = async (id) => {
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
    console.error("Error al eliminar paciente:", error);
    throw error;
  }
};
*/
