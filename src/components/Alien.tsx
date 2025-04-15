import React from 'react'
    import { Alien as AlienIcon } from 'lucide-react'

    interface AlienProps {
      x: number
      y: number
    }

    const AlienComponent: React.FC<AlienProps> = ({ x, y }) => {
      return (
        <div 
          className="absolute text-purple-500 animate-bounce" 
          style={{ left: `${x}px`, top: `${y}px` }}
        >
          <AlienIcon size={32} />
        </div>
      )
    }

    export default AlienComponent
