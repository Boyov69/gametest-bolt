import React from 'react'
    import { Rocket } from 'lucide-react'

    interface SpaceshipProps {
      x: number
      onShoot: () => void
    }

    const Spaceship: React.FC<SpaceshipProps> = ({ x, onShoot }) => {
      return (
        <div 
          className="absolute bottom-10 text-green-500" 
          style={{ left: `${x}px` }}
          onClick={onShoot}
        >
          <Rocket size={48} className="animate-pulse" />
        </div>
      )
    }

    export default Spaceship
