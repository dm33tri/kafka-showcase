import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'
import { messagesApi, getMessageId } from './messages'

export type Node = {
  id: string
  type: 'CONSUMER' | 'PRODUCER' | 'TOPIC'
}

export const nodesApi = createApi({
  reducerPath: 'nodesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createConsumer: builder.mutation<void, number>({
      query: id => `consumer?id=${id}`,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(nodesApi.util.updateQueryData('getAllNodes', undefined, nodes => {
          nodes.push({ id: `consumer_${id}`, type: 'CONSUMER' })
        }))
      }
    }),
    createProducer: builder.mutation<void, number>({
      query: id => `producer?id=${id}`,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(nodesApi.util.updateQueryData('getAllNodes', undefined, nodes => {
          nodes.push({ id: `producer_${id}`, type: 'PRODUCER' })
        }))
      }
    }),
    getAllNodes: builder.query<Node[], void>({
      queryFn() {
        return { data: [{ type: 'TOPIC', id: 'topic_0' }] }
      },
      async onCacheEntryAdded(_, { cacheEntryRemoved, cacheDataLoaded, dispatch }) {
        const { data: nodes } = await cacheDataLoaded
        const [, id] = nodes.slice().reverse().find(node => node.type === 'CONSUMER')?.id.match(/consumer_(\d+)/) || []
        if (!id) {
          return
        }
        const ws = new WebSocket('ws://localhost:8080')
        const listener = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data)
            const { From: from, To: to, Message: data, Timestamp: timestamp } = message
            dispatch(messagesApi.util.updateQueryData('getMessage', undefined, messages => {
              messages.push({
                id: getMessageId(),
                from: 'topic_0',
                timestamp: new Date(timestamp).valueOf(),
                data: `from ${from}: ${data}`,
                to: to
              })
            }))
          } catch {}
        }
        ws.send(id)
        ws.addEventListener('message', listener)
        await cacheEntryRemoved
        ws.close()
      }
    }),
  }),
})

export const { useGetAllNodesQuery } = nodesApi