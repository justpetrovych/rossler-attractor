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

function RosslerCurve({ a = 0.2, b = 0.2, c = 5.7 }) {
  const geometryRef = useRef()
  const materialRef = useRef()
  const [visiblePoints, setVisiblePoints] = useState(0)

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
    // Progressively draw the attractor
    if (visiblePoints < points.length) {
      setVisiblePoints(prev => Math.min(prev + 20, points.length))
    } else {
      // Loop the animation after a brief pause
      const elapsed = state.clock.getElapsedTime()
      if (elapsed % 30 < 0.1) {
        setVisiblePoints(0)
      }
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

function Scene() {
  const groupRef = useRef()

  // Slowly rotate the attractor
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      <RosslerCurve />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}

export default function RosslerAttractor() {
  return (
    <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[25, 25, 25]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
        <Scene />
      </Canvas>
    </div>
  )
}
