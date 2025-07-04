import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Alerta = ({
  open = false,
  onClose = () => {},
  titulo = "Título",
  mensaje = "Mensaje",
  tipo = "success", // success | error | warning | info | question
  posicion = "center", // top-end, bottom-start, center, etc.
  timer = 6000,
  showConfirmButton = false,
  confirmButtonText = "Aceptar",
  customIcon = null,
}) => {
  useEffect(() => {
    if (open) {
      MySwal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        position: posicion,
        timer: timer,
        showConfirmButton: showConfirmButton,
        confirmButtonText: confirmButtonText,
        customClass: {
          popup: "sweet-alert-custom",
        },
        didClose: onClose, // Se cierra solo o manual
        iconHtml: customIcon, // Si quieres icono personalizado SVG o emoji
      });
    }
  }, [
    open,
    titulo,
    mensaje,
    tipo,
    posicion,
    timer,
    showConfirmButton,
    confirmButtonText,
    customIcon,
    onClose,
  ]);

  return null; // No renderiza nada visual en el DOM
};

export default Alerta;
