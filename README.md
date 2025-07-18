# 🏥 Sistema de Reserva de Citas Médicas – Hospital San Juan

Este proyecto surge como solución a la problemática del **tiempo de espera prolongado** en la atención médica presencial en el Hospital San Juan. Se implementa una **plataforma web para la gestión de citas médicas en línea**, permitiendo a los pacientes reservar citas desde cualquier dispositivo con conexión a internet.

## 📌 Descripción general

El sistema permite a los usuarios registrarse, iniciar sesión, y agendar sus citas médicas según especialidades y disponibilidad del hospital. La aplicación cuenta con tres tipos de usuarios:

* 👤 **Paciente**: visualiza la página informativa, se registra con su DNI y accede a la reserva de citas.
* 🩺 **Doctor**: inicia sesión para ver y gestionar las citas asignadas.
* 🛠️ **Administrador**: gestiona usuarios, doctores, especialidades y sedes del hospital.

> El sistema está desarrollado con **React + Vite**, usando una arquitectura modular por vistas y componentes reutilizables, integrando estilos y diseño visual con Material UI.

---

## 🧩 Características

* ✅ Registro e inicio de sesión de usuarios (pacientes, doctores y administradores)
* ✅ Vista informativa del hospital (misión, visión e historia)
* ✅ Registro con validación por DNI
* ✅ Panel de control diferenciado por rol (doctor/admin)
* ✅ Gestión de citas, especialidades, sedes y horarios
* ✅ Notificaciones con SweetAlert2
* ✅ CRUD completo usando una API REST en Spring Boot (repositorio separado)

---

## 🛠️ Tecnologías utilizadas

| Tecnología                | Versión / Uso                         |
| ------------------------- | ------------------------------------- |
| **React**                 | v19                                   |
| **Vite**                  | v6                                    |
| **Material UI**           | v7                                    |
| **React Router**          | v7.6                                  |
| **Styled Components**     | v6                                    |
| **Dayjs**                 | Manejo de fechas                      |
| **SweetAlert2**           | Alertas y confirmaciones              |
| **Java 17 + Spring Boot** | Backend/API REST (repositorio aparte) |
| **MySQL**                 | Base de datos                         |
| **JWT**                   | Autenticación y control de roles      |

---

## 📂 Estructura del proyecto (frontend)

bash
📁 src/
├── api/                # Configuración y llamadas a la API
├── components/         # Componentes reutilizables (modales, formularios, tablas)
├── PaginaPaciente/     # Vista y flujo del paciente
│   └── index.jsx       # Vista principal del sistema
├── PaginaDoctor/       # Vista y funciones para el rol doctor
├── PaginaAdmin/        # Vista y funciones para el rol administrador
├── router/             # Rutas protegidas por rol
└── App.jsx             # Componente raíz


---

## 🚀 Instalación y ejecución

1. **Clonar el repositorio:**

bash
git clone https://github.com/tu-usuario/reserva-citas-frontend.git


2. **Instalar dependencias:**

bash
npm install


3. **Ejecutar el proyecto en modo desarrollo:**

bash
npm run dev


4. ⚠️ **Requisitos previos:**

* Tener instalado Node.js
* Tener conexión con la API REST (repositorio del backend)
* Tener MySQL activo y configurado

> 🔗 Repositorio del backend (Spring Boot – Java 17):
> 👉 [https://github.com/Alexzurit/Api-clinica](https://github.com/Alexzurit/Api-clinica)

---

## 🙌 Colaboración

Este proyecto fue desarrollado como trabajo universitario colaborativo:

* **Frontend (React + Vite)**: desarrollado íntegramente por **Juan Figue**
* **Backend (Spring Boot API REST)**: desarrollado por [Alexzurit](https://github.com/Alexzurit)

---

## 📄 Notas adicionales

* Algunas variables, componentes y funciones están en inglés o español según contexto técnico.
* Se recomienda conocimiento previo de React y Vite para comprender el flujo del código.
* Cada página conecta a un endpoint específico según el CRUD requerido (crear, leer, actualizar, eliminar).

