import { FC, useMemo, useRef } from "react"
import { useSelector } from "react-redux"
import * as THREE from "three"
import type { Mesh, BufferGeometry } from "three"
import { Point, Points } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import { RootState } from "../store"
import { NodeGeometries } from "../slices/nodeGeometries"
import { useGetMessageQuery } from "../services/messages"

type MessageProps = {
  from: number
  to: number
}

export const Message: FC<MessageProps> = ({ from, to }) => {
  const nodeGeometries = useSelector<RootState, NodeGeometries>(state => state.nodeGeometries)
  const ref = useRef<Mesh<BufferGeometry>>()
  const time = useRef(0)

  useFrame((_, delta) => {
    const start = nodeGeometries[from]?.current?.position
    const end =  nodeGeometries[to]?.current?.position
    time.current = (time.current + delta)
    if (!ref.current || !start || !end) {
      return
    }
    const mid = new THREE.Vector3(start.x, start.y + (end.y - start.y) / 2, 0)
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    const position = curve.getPointAt(time.current)
    ref.current.position.x = position.x
    ref.current.position.y = position.y
    ref.current.visible = true
  })

  // @ts-ignore
  return time.current < 1 ? <Point ref={ref} position={[-Infinity, -Infinity, 0]} /> : null
}

export const Messages: FC = () => {
  const { data } = useGetMessageQuery()

  const messages = useMemo(() => {
    return data?.flatMap(({ id, from, to: toMany }) => toMany.map(to => (
      <Message key={`${id}-${from}-${to}`} from={from} to={to} />
    )))
  }, [data])

  return (
    <Points>
      <pointsMaterial color="white" size={4} />
      {messages}
    </Points>
  )
}