import { FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import * as THREE from "three"
import type { Vector3 } from "three"
import { useThree } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { useDrag } from '@use-gesture/react'

import { setNodeGeometry } from '../slices/nodeGeometries'
import { useSendMessageMutation } from "../services/messages"
import { Node as NodeType, useGetAllNodesQuery } from '../services/nodes'

type NodeProps = NodeType & {
  initialPosition: Vector3
}

export const Node: FC<NodeProps> = ({ id, initialPosition }) => {
  const ref = useRef<any>()
  const [position, setPosition] = useState(initialPosition)
  const dispatch = useDispatch()
  const [sendMessage] = useSendMessageMutation()
  const { data: nodes } = useGetAllNodesQuery()

  const { size, camera } = useThree()

  useLayoutEffect(() => {
    dispatch(setNodeGeometry({ id, ref }))
  }, [id])

  const drag = useDrag(({ xy: [x, y] }) => {
    const newPos = new THREE.Vector3((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0)
      .unproject(camera)
      .clone()
    setPosition(newPos)
  })

  const onClick = useCallback(() => {
    if (nodes) {
      sendMessage({
        from: id,
        to: nodes.filter(({ id: otherId }) => otherId !== id).map(node => node.id),
        data: Math.random().toString()
      })
    }
  }, [sendMessage, nodes])

  return (
     // @ts-ignore
    <RoundedBox
      {...drag()}
      onClick={onClick}
      position={position}
      args={[1, 1, 0]}
      radius={0.25}
      smoothness={4}
      ref={ref}
    >
      <meshBasicMaterial color="white" />
    </RoundedBox>
  )
}

export const Nodes: FC = () => {
  const { data } = useGetAllNodesQuery()

  const nodes = useMemo(() => {
    if (!data) {
      return null
    }

    const circle = new THREE.EllipseCurve(0, 0, 3, 3, 0, 2 * Math.PI, false, 0).getPoints(data.length)

    return data.map(({ id }, index) => {
      const initialPosition = new THREE.Vector3(circle[index].x, circle[index].y, 0)
      return <Node key={id} id={id} initialPosition={initialPosition} />
    })
  }, [data])

  return (
    <>
      {nodes}
    </>
  )
}