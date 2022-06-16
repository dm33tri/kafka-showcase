import { FC, useMemo } from "react"
import { useGetMessageQuery } from "../services/messages"

export const Log: FC = () => {
  const { data } = useGetMessageQuery()

  const messages = useMemo(() => {
    if (!data) {
        return null
    }
    const messages = data?.slice(1000)
    messages.reverse()
    return messages.map(({ id, from, to, timestamp, data }) => (
        <div key={`${id}-${from}-${to}`}>{new Date(timestamp).toUTCString()}: {data}</div>
    ))
  }, [data])

  return <div className="h-full text-white overflow-y-auto overflow-x-hidden whitespace-nowrap text-ellipsis flex flex-col-reverse">
    {messages}
  </div>
}
