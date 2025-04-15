import React, { useState, useEffect, useCallback } from 'react'
import Spaceship from './components/Spaceship'
import Alien from './components/Alien'
import Laser from './components/Laser'

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const SPACESHIP_WIDTH = 50
const ALIEN_WIDTH = 40
const MOVE_SPEED = 5
const LASER_SPEED = 10

interface AlienType {
  id: number
  x: number
  y: number
}

interface LaserType {
  id: number
  x: number
  y: number
}

const App: React.FC = () => {
  const [spaceshipX, setSpaceshipX] = useState(GAME_WIDTH / 2 - SPACESHIP_WIDTH / 2)
  const [aliens, setAliens] = useState<AlienType[]>([])
  const [lasers, setLasers] = useState<LaserType[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Initialize aliens
  useEffect(() => {
    const initialAliens: AlienType[] = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        initialAliens.push({
          id: row * 10 + col,
          x: col * (ALIEN_WIDTH + 20) + 50,
          y: row * (ALIEN_WIDTH + 20) + 50
        })
      }
    }
    setAliens(initialAliens)
  }, [])

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setSpaceshipX(prev => Math.max(0, prev - MOVE_SPEED))
          break
        case 'ArrowRight':
          setSpaceshipX(prev => Math.min(GAME_WIDTH - SPACESHIP_WIDTH, prev + MOVE_SPEED))
          break
        case ' ':
          shootLaser()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Laser movement and collision detection
  useEffect(() => {
    if (gameOver) return

    const moveInterval = setInterval(() => {
      // Move lasers
      setLasers(prevLasers => 
        prevLasers
          .map(laser => ({ ...laser, y: laser.y - LASER_SPEED }))
          .filter(laser => laser.y > 0)
      )

      // Check for collisions
      setLasers(prevLasers => {
        const updatedLasers = [...prevLasers]
        const hitAliens: number[] = []

        prevLasers.forEach((laser, laserIndex) => {
          const hitAlien = aliens.findIndex(alien => 
            laser.x >= alien.x && 
            laser.x <= alien.x + ALIEN_WIDTH &&
            laser.y >= alien.y && 
            laser.y <= alien.y + ALIEN_WIDTH
          )

          if (hitAlien !== -1) {
            hitAliens.push(hitAlien)
            updatedLasers.splice(laserIndex, 1)
          }
        })

        // Remove hit aliens and update score
        if (hitAliens.length > 0) {
          setAliens(prevAliens => 
            prevAliens.filter((_, index) => !hitAliens.includes(index))
          )
          setScore(prev => prev + hitAliens.length * 10)
        }

        return updatedLasers
      })

      // Check game over condition
      if (aliens.some(alien => alien.y > GAME_HEIGHT - 100)) {
        setGameOver(true)
      }
    }, 50)

    return () => clearInterval(moveInterval)
  }, [aliens, gameOver])

  const shootLaser = useCallback(() => {
    setLasers(prev => [
      ...prev, 
      { 
        id: Date.now(), 
        x: spaceshipX + SPACESHIP_WIDTH / 2, 
        y: GAME_HEIGHT - 100 
      }
    ])
  }, [spaceshipX])

  const restartGame = () => {
    setSpaceshipX(GAME_WIDTH / 2 - SPACESHIP_WIDTH / 2)
    setAliens([])
    setLasers([])
    setScore(0)
    setGameOver(false)

    // Reinitialize aliens
    const initialAliens: AlienType[] = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        initialAliens.push({
          id: row * 10 + col,
          x: col * (ALIEN_WIDTH + 20) + 50,
          y: row * (ALIEN_WIDTH + 20) + 50
        })
      }
    }
    setAliens(initialAliens)
  }

  return (
    <div 
      className="relative bg-black text-white h-screen flex flex-col items-center justify-center"
      style={{ width: GAME_WIDTH, margin: '0 auto' }}
    >
      <div className="absolute top-5 text-2xl">
        Score: {score}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <h2 className="text-4xl mb-4">Game Over!</h2>
          <p className="text-2xl mb-4">Final Score: {score}</p>
          <button 
            onClick={restartGame}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Restart Game
          </button>
        </div>
      )}

      {aliens.map(alien => (
        <Alien key={alien.id} x={alien.x} y={alien.y} />
      ))}

      {lasers.map(laser => (
        <Laser key={laser.id} x={laser.x} y={laser.y} />
      ))}

      <Spaceship x={spaceshipX} onShoot={shootLaser} />
    </div>
  )
}

export default App
