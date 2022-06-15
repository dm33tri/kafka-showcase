import { FC, useMemo } from "react"
import * as THREE from "three"
import { Line } from "@react-three/drei"
import { useGetMessageQuery } from "../services/messages"

const BUCKETS = 10
const WIDTH = 10
const HEIGHT = 5

export const Graph: FC = () => {
  const { data } = useGetMessageQuery()

  const points = useMemo(() => {
    if (!data) {
        return
    }
    const sorted = data.filter(Boolean).sort((a, b) => a.timestamp - b.timestamp)
    const step = Math.ceil(sorted.length / BUCKETS)
    const buckets = data.reduce((buckets, _message, index) => {
        buckets[Math.floor(index / step)] += 1
        return buckets
    }, new Array(BUCKETS).fill(0))
    const coefficient = HEIGHT / Math.max(...buckets)
    console.log(buckets)
    return buckets.map((count, index) => new THREE.Vector3(index - 5, count * coefficient, 0))
  }, [data])

  return points ? (
    <Line points={points} color="white" />
  ) : null
}