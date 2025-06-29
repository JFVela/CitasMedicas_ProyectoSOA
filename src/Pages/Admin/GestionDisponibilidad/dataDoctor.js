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
