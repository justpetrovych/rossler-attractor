import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Rössler attractor differential equations
// dx/dt = -y - z
// dy/dt = x + ay
// dz/dt = b + z(x - c)
function rosslerStep(x, y, z, a, b, c, dt) {
  const dx = (-y - z) * dt
  const dy = (x + a * y) * dt
  const dz = (b + z * (x - c)) * dt
  return [x + dx, y + dy, z + dz]
}

function RosslerCurve({ a = 0.2, b = 0.2, c = 5.7, visiblePoints, setVisiblePoints }) {
  const geometryRef = useRef()
  const materialRef = useRef()

  // Generate Rössler attractor points
  const points = useMemo(() => {
    const numPoints = 10000
    const dt = 0.01
    let x = 0.1
    let y = 0
    let z = 0

    const pts = []

    // Skip initial transient points
    for (let i = 0; i < 1000; i++) {
      [x, y, z] = rosslerStep(x, y, z, a, b, c, dt)
    }

    // Collect points for rendering
    for (let i = 0; i < numPoints; i++) {
      [x, y, z] = rosslerStep(x, y, z, a, b, c, dt)
      pts.push(new THREE.Vector3(x, y, z))
    }

    return pts
  }, [a, b, c])

  // Animate drawing and color shift
  useFrame((state) => {
    // Progressively draw the attractor (run once)
    if (visiblePoints < points.length) {
      setVisiblePoints(prev => Math.min(prev + 20, points.length))
    }

    // Update draw range
    if (geometryRef.current) {
      geometryRef.current.setDrawRange(0, visiblePoints)
    }

    // Animate color shift
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      const hue = (time * 0.05) % 1
      materialRef.current.color.setHSL(hue, 0.8, 0.6)
    }
  })

  return (
    <line>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial ref={materialRef} color="#00ffff" linewidth={2} />
    </line>
  )
}

function Scene({ visiblePoints, setVisiblePoints }) {
  const groupRef = useRef()

  // Slowly rotate the attractor
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      <RosslerCurve visiblePoints={visiblePoints} setVisiblePoints={setVisiblePoints} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}

export default function RosslerAttractor() {
  const [visiblePoints, setVisiblePoints] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const handleRestart = () => {
    setVisiblePoints(0)
    setIsAnimating(true)
  }

  return (
    <div style={{ width: '100%', height: '800px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[25, 25, 25]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
        <Scene visiblePoints={visiblePoints} setVisiblePoints={setVisiblePoints} />
      </Canvas>

      <button
        onClick={handleRestart}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: 'rgba(102, 126, 234, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.9)'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        ↻ Restart Animation
      </button>
    </div>
  )
}
