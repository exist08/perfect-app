import { MMKV } from 'react-native-mmkv'
import { useState, useEffect } from 'react'

const storage = new MMKV()

export const useMMKVStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const item = storage.getString(key)
    if (item) {
      setValue(JSON.parse(item))
    }
  }, [])

  const setItem = (value: any) => {
    storage.set(key, JSON.stringify(value))
    setValue(value)
  }

  const removeItem = () => {
    storage.delete(key)
    setValue(initialValue)
  }
  return [value, setItem, removeItem]
}