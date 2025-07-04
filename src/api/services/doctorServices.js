import API from "../AxiosConfig";
import { API_ROUTES } from "../apiRoutes";

// Mapeo desde API (Doctor normal o DoctorResponseDTO)
const mapearDesdeAPI = (doctorAPI) => ({
    id: doctorAPI.idDoctor?.toString() || "",
    nombres: doctorAPI.nombres || "",
    apellidos: doctorAPI.apellidos || "",
    dni: doctorAPI.dni || "",
    cmp: doctorAPI.cmp || "",
    celular: doctorAPI.celular || "",
    estado: doctorAPI.estado === 1 || doctorAPI.estadoDoctor === 1 ? "Activo" : "Inactivo",
    especialidad: {
        id: doctorAPI.especialidad?.idespecialidad?.toString() || "",
        nombre: doctorAPI.especialidad?.nombre || doctorAPI.nombreEspecialidad || "Sin Especialidad",  // ← AQUÍ EL CAMBIO CLAVE
    },
    usuario: {
        correo: doctorAPI.emailUsuario || "",
        rol: doctorAPI.nombreRol || "",
    },
});


// Mapeo desde frontend hacia API para crear/actualizar Doctor (sin usuario)
const mapearHaciaAPIDoctor = (doctorLocal) => ({
    nombres: doctorLocal.nombres,
    apellidos: doctorLocal.apellidos,
    dni: doctorLocal.dni,
    cmp: doctorLocal.cmp,
    celular: doctorLocal.celular,
    estado: doctorLocal.estado === "Activo" ? 1 : 0,
    especialidad: {
        idespecialidad: parseInt(doctorLocal.especialidad.id, 10),
    },
});

// Mapeo desde frontend hacia API para crear Doctor con usuario
const mapearHaciaAPIRegistro = (doctorLocal) => ({
    nombres: doctorLocal.nombres,
    apellidos: doctorLocal.apellidos,
    dni: doctorLocal.dni,
    cmp: doctorLocal.cmp,
    celular: doctorLocal.celular,
    estado: doctorLocal.estado === "Activo" ? 1 : 0,
    especialidad: {
        idespecialidad: parseInt(doctorLocal.especialidad.id, 10),
    },
    usuario: {
        correo: doctorLocal.usuario?.correo || "",
        contrasenia: doctorLocal.usuario?.contrasenia || "",
        rol: doctorLocal.usuario?.rol || "3",  // por defecto
    },
});

// 👉 Obtener todos los doctores (GET /api/doctores)
export const obtenerDoctores = async () => {
    const response = await API.get(API_ROUTES.doctores);
    return response.data.map(mapearDesdeAPI);
};

// 👉 Crear doctor sin usuario (POST /api/doctores)
export const crearDoctorSinUsuario = async (doctor) => {
    const response = await API.post(API_ROUTES.doctores, mapearHaciaAPIDoctor(doctor));
    return mapearDesdeAPI(response.data);
};

// 👉 Crear doctor con usuario (POST /api/doctores/registrar)
export const crearDoctorConUsuario = async (doctor) => {
    const response = await API.post(`${API_ROUTES.doctores}/registrar`, mapearHaciaAPIRegistro(doctor));
    return mapearDesdeAPI(response.data);
};

// 👉 Actualizar doctor (PUT /api/doctores/{id})
export const actualizarDoctor = async (id, doctor) => {
    const response = await API.put(`${API_ROUTES.doctores}/${id}`, mapearHaciaAPIDoctor(doctor));
    return mapearDesdeAPI(response.data);
};

// 👉 Eliminar doctor (DELETE /api/doctores/{id})
export const eliminarDoctor = async (id) => {
    await API.delete(`${API_ROUTES.doctores}/${id}`);
    return true;
};
