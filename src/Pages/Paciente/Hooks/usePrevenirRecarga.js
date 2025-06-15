"use client"

import { useEffect } from "react"

export function usePrevenirRecarga(debePrevenir) {
  useEffect(() => {
    const manejarAntesDeDescargar = (e) => {
      if (debePrevenir) {
        e.preventDefault()
        e.returnValue = "¿Estás seguro de que quieres salir? Los datos del formulario se perderán."
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", manejarAntesDeDescargar)

    return () => {
      window.removeEventListener("beforeunload", manejarAntesDeDescargar)
    }
  }, [debePrevenir])
}
