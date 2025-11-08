import React from 'react'
import RosslerAttractor from './RosslerAttractor'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>The Rössler Attractor</h1>
        <p className="subtitle">A Beautiful Journey into Chaos Theory</p>
      </header>

      <main className="main">
        <section className="intro-section">
          <div className="content-box">
            <h2>What is the Rössler Attractor?</h2>
            <p>
              The Rössler attractor is a system of three non-linear ordinary differential equations
              that exhibits chaotic behavior. It was discovered by Otto Rössler in 1976 while studying
              chemical reactions. Unlike the more complex Lorenz attractor, the Rössler attractor is
              designed to be one of the simplest continuous dynamical systems that can exhibit chaotic behavior.
            </p>
          </div>
        </section>

        <section className="visualization-section">
          <h2>Interactive 3D Visualization</h2>
          <p className="viz-instructions">
            Drag to rotate • Scroll to zoom • Watch the chaos unfold
          </p>
          <div className="canvas-container">
            <RosslerAttractor />
          </div>
        </section>

        <section className="math-section">
          <div className="content-box">
            <h2>The Mathematics</h2>
            <p>
              The Rössler attractor is defined by the following system of differential equations:
            </p>
            <div className="equations">
              <BlockMath math="\frac{dx}{dt} = -y - z" />
              <BlockMath math="\frac{dy}{dt} = x + ay" />
              <BlockMath math="\frac{dz}{dt} = b + z(x - c)" />
            </div>
            <p>
              Where <InlineMath math="a" />, <InlineMath math="b" />, and <InlineMath math="c" /> are
              constants. The typical values used to generate chaotic behavior are:
            </p>
            <div className="parameters">
              <BlockMath math="a = 0.2, \quad b = 0.2, \quad c = 5.7" />
            </div>
          </div>
        </section>

        <section className="properties-section">
          <div className="grid">
            <div className="card">
              <h3>Chaos</h3>
              <p>
                The system is extremely sensitive to initial conditions - tiny changes in starting
                values lead to vastly different trajectories over time, a hallmark of chaotic systems.
              </p>
            </div>
            <div className="card">
              <h3>Strange Attractor</h3>
              <p>
                Despite being chaotic, the system is drawn to a specific region of phase space,
                creating the beautiful spiral structure you see above.
              </p>
            </div>
            <div className="card">
              <h3>Deterministic</h3>
              <p>
                The system is completely deterministic - there's no randomness involved. The chaos
                emerges naturally from the non-linear interactions between variables.
              </p>
            </div>
            <div className="card">
              <h3>Bounded</h3>
              <p>
                Even though the trajectory never repeats, it remains confined to a finite region
                of space, never escaping to infinity.
              </p>
            </div>
          </div>
        </section>

        <section className="applications-section">
          <div className="content-box">
            <h2>Applications & Significance</h2>
            <p>
              The Rössler attractor has applications in various fields:
            </p>
            <ul>
              <li><strong>Chemistry:</strong> Modeling oscillating chemical reactions</li>
              <li><strong>Biology:</strong> Understanding biological rhythms and patterns</li>
              <li><strong>Physics:</strong> Studying nonlinear dynamics and turbulence</li>
              <li><strong>Engineering:</strong> Secure communications using chaos-based encryption</li>
              <li><strong>Mathematics:</strong> Exploring the boundaries between order and chaos</li>
            </ul>
            <p>
              Its relative simplicity compared to other chaotic systems makes it an excellent
              tool for teaching and understanding fundamental concepts in chaos theory.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Discovered by Otto Rössler in 1976 • Interactive visualization built with React & Three.js
        </p>
      </footer>
    </div>
  )
}

export default App
