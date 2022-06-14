import { createContext, FC, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Point, Points } from '@react-three/drei'
import { useDrag } from '@use-gesture/react'

import './App.css';
import { Vector3 } from 'three'

const VECTOR = new THREE.Vector3()
const VECTOR_Z = new THREE.Vector3(1, 1, 0)
type NodeContext = ReturnType<typeof useState<Vector3[]>> | null
const NodeContext = createContext<NodeContext>(null);

const Node: FC<{ position: Vector3}> = ({ position: startNode }) => {
  const [position, setPosition] = useState(() => startNode)
  const { size, camera } = useThree();
  const [_, setNodes] = useContext(NodeContext)!

  useLayoutEffect(() => {
    setNodes(nodes => {
      const newNodes = nodes!.map(node => node === startNode ? position : node)
      return newNodes;
    })
  }, [position])

  const drag = useDrag(({ xy: [x, y] }) => {
    const newPos = VECTOR
      .set((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0)
      .unproject(camera)
      .multiply(VECTOR_Z)
      .clone()
    setPosition(newPos)
  })

  return (
    <RoundedBox {...drag()} position={position} args={[1, 1, 0]} radius={0.25} smoothness={4}>
      <meshBasicMaterial color="grey" />
    </RoundedBox>
  )
}

const Message: FC<{ from: Vector3, to: Vector3 }> = ({ from, to }) => {
  const ref = useRef<any>()
  const time = useRef(0)
  const curve = useMemo(() => {
    const mid = from.clone().add(new THREE.Vector3(0, (to.y - from.y) / 2, 0))
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])
  useFrame((_, delta) => {
    if (time.current >= 1) {
      return
    }
    time.current = (time.current + delta)
    const position = curve.getPointAt(time.current)
    ref.current.position.x = position.x
    ref.current.position.y = position.y
  })

  return <Point ref={ref} />
}

function App() {
  const [nodes, setNodes] = useState<Vector3[]>([
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(0, -2, 0),
  ])

  const [messages, setMessages] = useState<[Vector3, Vector3][]>([])

  const lines = useMemo(() => {
    const result = []
    for (let i = 0; i < nodes.length; ++i) {
      for (let j = i + 1; j < nodes.length; ++j) {
        const start = nodes[i].clone()
        const end = nodes[j].clone()
    
        result.push([start, end])
      }
    }
    return result
  }, [nodes])

  return (
      <Canvas orthographic camera={{ zoom: 80 }} dpr={[1, 2]}>
        <NodeContext.Provider value={[nodes, setNodes]}>
          {nodes.map((node, index) => (
            <Node key={index} position={node} />
          ))}
          {lines.map(([from, to], index) => (
            <Points key={index}>
              <Message from={from} to={to} />
              <pointsMaterial color="white" size={2} />
            </Points>
          ))}
          </NodeContext.Provider>
      </Canvas>
  )
}

export default App
