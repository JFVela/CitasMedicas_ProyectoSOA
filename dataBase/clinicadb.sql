-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-06-2025 a las 07:23:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE
= "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone
= "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clinicadb`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `registrar_cita_medica`
(IN `p_dni` CHAR
(8), IN `p_id_dispon` INT, IN `p_motivo` TEXT)
BEGIN
  DECLARE v_id_paciente INT;

SELECT id_paciente
INTO v_id_paciente
FROM paciente
WHERE dni = p_dni;

IF v_id_paciente IS NOT NULL THEN
INSERT INTO cita
  (id_paciente, id_disponibilidad, estado, motivo_consulta)
VALUES
  (v_id_paciente, p_id_dispon, 1, p_motivo);
-- estado 1 = Pendiente
ELSE
    SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT
= 'Paciente no encontrado con ese DNI';
END
IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita`
(
  `id_cita` int
(11) NOT NULL,
  `id_paciente` int
(11) NOT NULL,
  `id_disponibilidad` int
(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp
(),
  `estado` tinyint
(4) NOT NULL,
  `motivo_consulta` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`
id_cita`,
`id_paciente
`, `id_disponibilidad`, `fecha`, `estado`, `motivo_consulta`) VALUES
(1, 2, 2, '2025-06-29 01:55:31', 3, 'Lele pancha'),
(9, 2, 2, '2025-06-29 05:19:07', 1, 'Me duele mucho el pecho');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad`
--

CREATE TABLE `disponibilidad`
(
  `id_disponibilidad` int
(11) NOT NULL,
  `id_doctor` int
(11) NOT NULL,
  `id_sede` int
(11) NOT NULL,
  `id_horario` int
(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `disponibilidad`
--

INSERT INTO `disponibilidad` (`
id_disponibilidad`,
`id_doctor
`, `id_sede`, `id_horario`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(2, 56, 9, 3, '2025-06-02', '2025-07-19', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctor`
--

CREATE TABLE `doctor`
(
  `id_doctor` int
(11) NOT NULL,
  `id_especialidad` int
(11) NOT NULL,
  `nombres` varchar
(50) NOT NULL,
  `apellidos` varchar
(50) NOT NULL,
  `dni` char
(8) NOT NULL,
  `cmp` varchar
(10) NOT NULL,
  `correo` varchar
(100) NOT NULL,
  `celular` varchar
(15) NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `doctor`
--

INSERT INTO `doctor` (`
id_doctor`,
`id_especialidad
`, `nombres`, `apellidos`, `dni`, `cmp`, `correo`, `celular`, `estado`) VALUES
(56, 5, 'Alex Eduardo', 'Zurita Julca', '73005956', '145236', 'U19203708@utp.edu.pe', '935724298', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad`
(
  `id_especialidad` int
(11) NOT NULL,
  `nombre` varchar
(50) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `especialidad`
--

INSERT INTO `especialidad` (`
id_especialidad`,
`nombre
`, `descripcion`, `estado`) VALUES
(2, 'Dermatologí', 'Los dermatólogos son los que tratan los desordenes de la piel en  cabello, uñas y membranas mucosas adyacentes ya sea los adultos o niños. Ellos diagnostican desde cáncer de piel, tumores, enfermedades inflamatorias de la piel, y enfermedades infecciosas.', 1),
(4, 'Oftalmología', 'La Oftalmología es el área que trata las enfermedades o desordenes de los ojos como cataratas y glaucoma. Ellos también realizan cirugía de ojo cuando es necesario.', 0),
(5, 'Neumología', 'Los neumólogos tratan el sistema cardíaco-pulmonar, que consiste en los órganos que trabajan juntos para ayudar a que la persona respire, como el corazón y los pulmones', 0),
(7, 'Psicología ', 'Área encargado de la salud mental de sus pacientes.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico`
(
  `id_historial` int
(11) NOT NULL,
  `id_cita` int
(11) NOT NULL,
  `fecha_Registro` timestamp NOT NULL DEFAULT current_timestamp
(),
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `receta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`
id_historial`,
`id_cita
`, `fecha_Registro`, `diagnostico`, `tratamiento`, `receta`) VALUES
(1, 1, '2025-06-29 03:51:01', 'Muy guapo', 'Dejar de ser papucho', 'Mas juegos del left');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario`
(
  `id_horario` int
(11) NOT NULL,
  `dia_semana` varchar
(10) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`
id_horario`,
`dia_semana
`, `hora_inicio`, `hora_fin`, `estado`) VALUES
(1, 'Lunes', '08:00:00', '12:00:00', 1),
(2, 'Lunes', '13:00:00', '17:00:00', 1),
(3, 'Lunes', '19:00:00', '21:00:00', 1),
(4, 'Martes', '08:00:00', '12:00:00', 1),
(5, 'Martes', '13:00:00', '17:00:00', 1),
(6, 'Martes', '18:00:00', '21:00:00', 1),
(7, 'Miércoles', '08:00:00', '12:00:00', 1),
(8, 'Miércoles', '13:00:00', '17:00:00', 1),
(9, 'Miércoles', '18:00:00', '21:00:00', 1),
(10, 'Jueves', '08:00:00', '12:00:00', 1),
(11, 'Jueves', '13:00:00', '17:00:00', 1),
(12, 'Jueves', '18:00:00', '21:00:00', 1),
(13, 'Viernes', '08:00:00', '12:00:00', 1),
(14, 'Viernes', '13:00:00', '17:00:00', 1),
(15, 'Viernes', '18:00:00', '21:00:00', 1),
(16, 'Sábado', '08:00:00', '12:00:00', 1),
(17, 'Sábado', '13:00:00', '16:00:00', 1),
(18, 'Sábado', '00:00:00', '00:00:00', 0),
(19, 'Domingo', '08:00:00', '12:00:00', 0),
(20, 'Domingo', '13:00:00', '17:00:00', 0),
(21, 'Domingo', '18:00:00', '21:00:00', 0),
(22, 'Lunes', '13:45:37', '14:45:37', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente`
(
  `id_paciente` int
(11) NOT NULL,
  `nombres` varchar
(50) NOT NULL,
  `apellidos` varchar
(50) NOT NULL,
  `dni` char
(8) NOT NULL,
  `correo` varchar
(100) DEFAULT NULL,
  `celular` varchar
(15) NOT NULL,
  `direccion` text NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `sexo` text NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`
id_paciente`,
`nombres
`, `apellidos`, `dni`, `correo`, `celular`, `direccion`, `fechaNacimiento`, `sexo`, `estado`) VALUES
(2, 'Juan', 'Figueroa', '73090035', 'jfvela_2012@hotmail.com', '998187600', 'Mz B1 Lt 6 Alfredo Villa Calderon', '2002-11-07', 'M', 1),
(3, 'Zurita', 'Alex', '85698563', 'cc@hotmail.com', '985633629', 'mz b4 lt Gaaa', '2001-05-11', 'M', 0),
(4, 'Jean Franco ', 'Figueroa', '98563202', 'cfc@hotmail.com', '985263699', 'mz sss', '2002-02-28', 'M', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sede`
--

CREATE TABLE `sede`
(
  `id_sede` int
(11) NOT NULL,
  `nombre` varchar
(50) NOT NULL,
  `direccion` text NOT NULL,
  `distrito` varchar
(50) NOT NULL,
  `estado` tinyint
(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `sede`
--

INSERT INTO `sede` (`
id_sede`,
`nombre
`, `direccion`, `distrito`, `estado`) VALUES
(9, 'Lima Norte', 'Mz 16 Lt x Al frente de Plaza norte', 'Comas', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_permisos`
--

CREATE TABLE `tb_permisos`
(
  `id_permiso` int
(11) NOT NULL,
  `id_rol` int
(11) NOT NULL,
  `url` varchar
(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_rol`
--

CREATE TABLE `tb_rol`
(
  `id_rol` int
(11) NOT NULL,
  `nombre_rol` varchar
(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_rol`
--

INSERT INTO `tb_rol` (`
id_rol`,
`nombre_rol
`) VALUES
(1, 'administrador'),
(3, 'medico'),
(2, 'recepcionista');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_usuario`
--

CREATE TABLE `tb_usuario`
(
  `id_usuario` int
(11) NOT NULL,
  `dni` varchar
(10) NOT NULL,
  `email` varchar
(100) NOT NULL,
  `password_hash` text NOT NULL,
  `estado` enum
('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp
()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_usuario`
--

INSERT INTO `tb_usuario` (`
id_usuario`,
`dni
`, `email`, `password_hash`, `estado`, `fecha_creacion`) VALUES
(10, '73005956', 'zarblexplay@gmail.com', '$2a$10$/XMUGKHrMuDWa2Mdxws/Zu2ixeuuS0eukXOn75wSaE1ItqAmOx/2G', 'activo', '2025-05-23 01:25:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_usuario_rol`
--

CREATE TABLE `tb_usuario_rol`
(
  `id_usuario` int
(11) NOT NULL,
  `id_rol` int
(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_usuario_rol`
--

INSERT INTO `tb_usuario_rol` (`
id_usuario`,
`id_rol
`) VALUES
(10, 1),
(10, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
ADD PRIMARY KEY
(`id_cita`),
ADD KEY `fk_reservacita_paciente1_idx`
(`id_paciente`),
ADD KEY `fk_cita_disponibilidad1_idx`
(`id_disponibilidad`);

--
-- Indices de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
ADD PRIMARY KEY
(`id_disponibilidad`),
ADD KEY `fk_disponibilidad_doctor1_idx`
(`id_doctor`),
ADD KEY `fk_disponibilidad_sede1_idx`
(`id_sede`),
ADD KEY `fk_disponibilidad_horario1_idx`
(`id_horario`);

--
-- Indices de la tabla `doctor`
--
ALTER TABLE `doctor`
ADD PRIMARY KEY
(`id_doctor`),
ADD UNIQUE KEY `dni_UNIQUE`
(`dni`),
ADD KEY `fk_doctor_especialidad_idx`
(`id_especialidad`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
ADD PRIMARY KEY
(`id_especialidad`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
ADD PRIMARY KEY
(`id_historial`),
ADD KEY `fk_historial_medico_cita1_idx`
(`id_cita`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
ADD PRIMARY KEY
(`id_horario`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
ADD PRIMARY KEY
(`id_paciente`),
ADD UNIQUE KEY `dni_UNIQUE`
(`dni`);

--
-- Indices de la tabla `sede`
--
ALTER TABLE `sede`
ADD PRIMARY KEY
(`id_sede`),
ADD UNIQUE KEY `ruc_UNIQUE`
(`distrito`);

--
-- Indices de la tabla `tb_permisos`
--
ALTER TABLE `tb_permisos`
ADD PRIMARY KEY
(`id_permiso`),
ADD KEY `id_rol`
(`id_rol`);

--
-- Indices de la tabla `tb_rol`
--
ALTER TABLE `tb_rol`
ADD PRIMARY KEY
(`id_rol`),
ADD UNIQUE KEY `nombre_rol`
(`nombre_rol`);

--
-- Indices de la tabla `tb_usuario`
--
ALTER TABLE `tb_usuario`
ADD PRIMARY KEY
(`id_usuario`),
ADD UNIQUE KEY `dni`
(`dni`),
ADD UNIQUE KEY `email`
(`email`);

--
-- Indices de la tabla `tb_usuario_rol`
--
ALTER TABLE `tb_usuario_rol`
ADD PRIMARY KEY
(`id_usuario`,`id_rol`),
ADD KEY `id_rol`
(`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `id_cita` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `doctor`
--
ALTER TABLE `doctor`
  MODIFY `id_doctor` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `id_especialidad` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id_historial` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id_paciente` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `sede`
--
ALTER TABLE `sede`
  MODIFY `id_sede` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tb_permisos`
--
ALTER TABLE `tb_permisos`
  MODIFY `id_permiso` int
(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tb_rol`
--
ALTER TABLE `tb_rol`
  MODIFY `id_rol` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tb_usuario`
--
ALTER TABLE `tb_usuario`
  MODIFY `id_usuario` int
(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
ADD CONSTRAINT `fk_cita_disponibilidad1` FOREIGN KEY
(`id_disponibilidad`) REFERENCES `disponibilidad`
(`id_disponibilidad`) ON
DELETE NO ACTION ON
UPDATE NO ACTION,
ADD CONSTRAINT `fk_reservacita_paciente1` FOREIGN KEY
(`id_paciente`) REFERENCES `paciente`
(`id_paciente`) ON
DELETE NO ACTION ON
UPDATE NO ACTION;

--
-- Filtros para la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
ADD CONSTRAINT `fk_disponibilidad_doctor1` FOREIGN KEY
(`id_doctor`) REFERENCES `doctor`
(`id_doctor`) ON
DELETE NO ACTION ON
UPDATE NO ACTION,
ADD CONSTRAINT `fk_disponibilidad_horario1` FOREIGN KEY
(`id_horario`) REFERENCES `horario`
(`id_horario`) ON
DELETE NO ACTION ON
UPDATE NO ACTION,
ADD CONSTRAINT `fk_disponibilidad_sede1` FOREIGN KEY
(`id_sede`) REFERENCES `sede`
(`id_sede`) ON
DELETE NO ACTION ON
UPDATE NO ACTION;

--
-- Filtros para la tabla `doctor`
--
ALTER TABLE `doctor`
ADD CONSTRAINT `fk_doctor_especialidad` FOREIGN KEY
(`id_especialidad`) REFERENCES `especialidad`
(`id_especialidad`) ON
DELETE NO ACTION ON
UPDATE NO ACTION;

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
ADD CONSTRAINT `fk_historial_medico_cita1` FOREIGN KEY
(`id_cita`) REFERENCES `cita`
(`id_cita`) ON
DELETE NO ACTION ON
UPDATE NO ACTION;

--
-- Filtros para la tabla `tb_permisos`
--
ALTER TABLE `tb_permisos`
ADD CONSTRAINT `tb_permisos_ibfk_1` FOREIGN KEY
(`id_rol`) REFERENCES `tb_rol`
(`id_rol`) ON
DELETE CASCADE;

--
-- Filtros para la tabla `tb_usuario_rol`
--
ALTER TABLE `tb_usuario_rol`
ADD CONSTRAINT `tb_usuario_rol_ibfk_1` FOREIGN KEY
(`id_usuario`) REFERENCES `tb_usuario`
(`id_usuario`) ON
DELETE CASCADE,
ADD CONSTRAINT `tb_usuario_rol_ibfk_2` FOREIGN KEY
(`id_rol`) REFERENCES `tb_rol`
(`id_rol`) ON
DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
