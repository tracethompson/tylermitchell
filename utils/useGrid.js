import { useState } from 'react'

export default function useGrid() {
  const [imageGrid, setGrid] = useState(false)
  
  return [imageGrid, setGrid]
}
