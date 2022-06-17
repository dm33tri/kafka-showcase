import { FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import * as THREE from "three"
import type { Vector3 } from "three"
import { useThree } from "@react-three/fiber"
import { RoundedBox, Text } from "@react-three/drei"
import { useDrag } from '@use-gesture/react'

import { setNodeGeometry } from '../slices/nodeGeometries'
import { useSendMessageMutation } from "../services/messages"
import { Node as NodeType, useGetAllNodesQuery } from '../services/nodes'

type NodeProps = NodeType & {
  initialPosition: Vector3
}

export const Node: FC<NodeProps> = ({ id, type, initialPosition }) => {
  const ref = useRef<any>()
  const [position, setPosition] = useState(initialPosition)
  const dispatch = useDispatch()
  const [sendMessage] = useSendMessageMutation()

  const { size, camera } = useThree()

  useLayoutEffect(() => {
    dispatch(setNodeGeometry({ id, ref }))
  }, [id])

  // @ts-ignore
  const drag = useDrag(({ xy: [x, y] }) => {
    const newPos = new THREE.Vector3((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0)
      .unproject(camera)
      .clone()
    setPosition(newPos)
  })

  const onClick = useCallback(() => {
    if (type === 'PRODUCER') {
      sendMessage()
    }
  }, [sendMessage, type])

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
      <meshBasicMaterial color="black" />
      <Text position={[0, 0, 1]} fontSize={0.1}>
        {id}
      </Text>
    </RoundedBox>
  )
}

export const Nodes: FC = () => {
  const { data: { nodes: data } = {} } = useGetAllNodesQuery()

  const nodes = useMemo(() => {
    if (!data) {
      return null
    }

    const circle = new THREE.EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0).getPoints(data.length - 1)

    return data.map(({ id, type }, index) => {
      const initialPosition = type === 'TOPIC' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(circle[index].x, circle[index].y, 0)
      return <Node key={id} id={id} type={type} initialPosition={initialPosition} />
    })
  }, [data])

  return (
    <>
      {nodes}
    </>
  )
}