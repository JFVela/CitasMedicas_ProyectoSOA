import API from "../AxiosConfig";
import { API_ROUTES } from "../apiRoutes";

// Mapear datos desde la API al formato local
const mapearDesdeAPI = (pacienteAPI) => ({
    id: pacienteAPI.idpaciente?.toString(),
    nombres: pacienteAPI.nombres,
    apellidos: pacienteAPI.apellidos,
    dni: pacienteAPI.dni,
    correo: pacienteAPI.correo,
    celular: pacienteAPI.celular,
    direccion: pacienteAPI.direccion,
    fechaNacimiento: pacienteAPI.fechaNacimiento, // formato ISO (yyyy-MM-dd)
    sexo: pacienteAPI.sexo,
    estado: pacienteAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Mapear datos desde el frontend hacia la API
const mapearHaciaAPI = (pacienteLocal) => ({
    nombres: pacienteLocal.nombres,
    apellidos: pacienteLocal.apellidos,
    dni: pacienteLocal.dni,
    correo: pacienteLocal.correo,
    celular: pacienteLocal.celular,
    direccion: pacienteLocal.direccion,
    fechaNacimiento: pacienteLocal.fechaNacimiento,
    sexo: pacienteLocal.sexo,
    estado: pacienteLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todos los pacientes
export const obtenerPacientes = async () => {
    const response = await API.get(API_ROUTES.pacientes);
    return response.data.map(mapearDesdeAPI);
};

// Crear nuevo paciente
export const crearPaciente = async (paciente) => {
    const response = await API.post(API_ROUTES.pacientes, mapearHaciaAPI(paciente));
    return mapearDesdeAPI(response.data);
};

// Actualizar paciente
export const actualizarPaciente = async (id, paciente) => {
    const response = await API.put(`${API_ROUTES.pacientes}/${id}`, mapearHaciaAPI(paciente));
    return mapearDesdeAPI(response.data);
};

// Eliminar paciente (opcional: comentar si no lo quieres usar)
export const eliminarPaciente = async (id) => {
    await API.delete(`${API_ROUTES.pacientes}/${id}`);
    return true;
};
