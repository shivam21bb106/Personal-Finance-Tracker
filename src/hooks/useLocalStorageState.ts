import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

type UseLocalStorageOptions<T> = {
  deserialize?: (value: string) => T
  serialize?: (value: T) => string
}

export function useLocalStorageState<T>(
  key: string,
  fallback: () => T,
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const { deserialize = JSON.parse, serialize = JSON.stringify } = options

  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)

    if (stored === null) {
      return fallback()
    }

    try {
      return deserialize(stored)
    } catch {
      return fallback()
    }
  })

  useEffect(() => {
    localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}
