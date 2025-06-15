"use client"

import { useEffect } from "react"

export function usePreventReload(shouldPrevent: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault()
        e.returnValue = "¿Estás seguro de que quieres salir? Los datos del formulario se perderán."
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [shouldPrevent])
}
