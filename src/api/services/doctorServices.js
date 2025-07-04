import API from "../AxiosConfig";
import {API_ROUTES} from "../apiRoutes";

// Mapear datos desde la API al frontend
const mapearDesdeAPI = (doctorAPI) => ({
    id: doctorAPI.idDoctor?.toString(),
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

// Mapear datos desde el frontend a la API
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

export const obtenerDoctores = async () => {
    const response = await API.get(API_ROUTES.doctores);
    return response.data.map(mapearDesdeAPI);
};

export const crearDoctor = async (doctor) => {
    const response = await API.post(API_ROUTES.doctores, mapearHaciaAPI(doctor));
    return mapearDesdeAPI(response.data);
};

export const actualizarDoctor = async (id, doctor) => {
    const response = await API.put(`${API_ROUTES.doctores}/${id}`, mapearHaciaAPI(doctor));
    return mapearDesdeAPI(response.data);
};

export const eliminarDoctor = async (id) => {
    await API.delete(`${API_ROUTES.doctores}/${id}`);
    return true;
};
