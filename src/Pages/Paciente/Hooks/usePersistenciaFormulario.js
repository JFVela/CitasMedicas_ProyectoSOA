"use client"

import { useState } from "react"

export function usePersistenciaFormulario(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const item = window.localStorage.getItem(clave)
      return item ? JSON.parse(item) : valorInicial
    } catch (error) {
      console.error("Error cargando desde localStorage:", error)
      return valorInicial
    }
  })

  const setValorAlmacenado = (nuevoValor) => {
    try {
      const valorAGuardar = typeof nuevoValor === "function" ? nuevoValor(valor) : nuevoValor
      setValor(valorAGuardar)
      window.localStorage.setItem(clave, JSON.stringify(valorAGuardar))
    } catch (error) {
      console.error("Error guardando en localStorage:", error)
    }
  }

  return [valor, setValorAlmacenado]
}
