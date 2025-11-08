import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const DEFAULT_PARAMS = { a: 0.2, b: 0.2, c: 5.7 }

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

function Scene({ visiblePoints, setVisiblePoints, a, b, c }) {
  const groupRef = useRef()

  // Slowly rotate the attractor
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      <RosslerCurve
        a={a}
        b={b}
        c={c}
        visiblePoints={visiblePoints}
        setVisiblePoints={setVisiblePoints}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}

export default function RosslerAttractor() {
  const [visiblePoints, setVisiblePoints] = useState(0)
  const [a, setA] = useState(DEFAULT_PARAMS.a)
  const [b, setB] = useState(DEFAULT_PARAMS.b)
  const [c, setC] = useState(DEFAULT_PARAMS.c)
  const [debouncedParams, setDebouncedParams] = useState({ a: DEFAULT_PARAMS.a, b: DEFAULT_PARAMS.b, c: DEFAULT_PARAMS.c })

  // Debounce parameter changes and restart animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedParams({ a, b, c })
      setVisiblePoints(0) // Restart animation
    }, 500)

    return () => clearTimeout(timeout)
  }, [a, b, c])

  const handleRestart = () => {
    setVisiblePoints(0)
  }

  const handleReset = () => {
    setA(DEFAULT_PARAMS.a)
    setB(DEFAULT_PARAMS.b)
    setC(DEFAULT_PARAMS.c)
  }

  const incrementParam = (param, setter, value) => {
    setter(Number((value + 0.1).toFixed(1)))
  }

  const decrementParam = (param, setter, value) => {
    setter(Number((value - 0.1).toFixed(1)))
  }

  const paramControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  }

  const labelStyle = {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '50px',
  }

  const inputStyle = {
    width: '70px',
    padding: '6px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
    cursor: 'default',
  }

  const buttonStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(102, 126, 234, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
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
        <Scene
          visiblePoints={visiblePoints}
          setVisiblePoints={setVisiblePoints}
          a={debouncedParams.a}
          b={debouncedParams.b}
          c={debouncedParams.c}
        />
      </Canvas>

      {/* Parameter Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
      }}>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
          Parameters
        </div>

        {/* Parameter a */}
        <div style={paramControlStyle}>
          <span style={labelStyle}>a =</span>
          <button
            style={buttonStyle}
            onClick={() => decrementParam('a', setA, a)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            −
          </button>
          <input
            type="number"
            value={a}
            readOnly
            style={inputStyle}
            step="0.1"
          />
          <button
            style={buttonStyle}
            onClick={() => incrementParam('a', setA, a)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            +
          </button>
        </div>

        {/* Parameter b */}
        <div style={paramControlStyle}>
          <span style={labelStyle}>b =</span>
          <button
            style={buttonStyle}
            onClick={() => decrementParam('b', setB, b)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            −
          </button>
          <input
            type="number"
            value={b}
            readOnly
            style={inputStyle}
            step="0.1"
          />
          <button
            style={buttonStyle}
            onClick={() => incrementParam('b', setB, b)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            +
          </button>
        </div>

        {/* Parameter c */}
        <div style={paramControlStyle}>
          <span style={labelStyle}>c =</span>
          <button
            style={buttonStyle}
            onClick={() => decrementParam('c', setC, c)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            −
          </button>
          <input
            type="number"
            value={c}
            readOnly
            style={inputStyle}
            step="0.1"
          />
          <button
            style={buttonStyle}
            onClick={() => incrementParam('c', setC, c)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.8)'}
          >
            +
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: 'rgba(118, 75, 162, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(118, 75, 162, 1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(118, 75, 162, 0.8)'}
        >
          Reset to Default
        </button>
      </div>

      {/* Restart Animation Button */}
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
