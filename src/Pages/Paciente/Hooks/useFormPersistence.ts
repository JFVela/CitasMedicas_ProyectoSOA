"use client"

import { useState } from "react"

export function useFormPersistence<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return initialValue
    }
  })

  const setStoredValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(value) : value
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return [value, setStoredValue] as const
}
