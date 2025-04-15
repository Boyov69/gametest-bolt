import React from 'react'

interface LaserProps {
  x: number
  y: number
}

const Laser: React.FC<LaserProps> = ({ x, y }) => {
  return (
    <div 
      className="absolute w-1 h-8 bg-red-500" 
      style={{ left: `${x}px`, top: `${y}px` }}
    />
  )
}

export default Laser
