import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { is } from 'immer/dist/internal'
import { BASE_URL } from '../constants'
import { messagesApi, getMessageId } from './messages'

export type Node = {
  id: string
  type: 'CONSUMER' | 'PRODUCER' | 'TOPIC'
}

const ws = new WebSocket(`ws://178.20.45.246:8080/connection`)

export const nodesApi = createApi({
  reducerPath: 'nodesApi',
  tagTypes: ['Nodes'],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createConsumer: builder.mutation<void, number>({
      query: id => ({
        url: `consumer?id=${id}`,
        method: 'post',
        validateStatus: () => true
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(nodesApi.util.updateQueryData('getAllNodes', undefined, data => {
          data.nodes.push({ id: `consumer_${id}`, type: 'CONSUMER' })
        }))
        await queryFulfilled
      }
    }),
    createProducer: builder.mutation<void, number>({
      query: id => ({
        url: `producer?id=${id}`,
        method: 'post',
        validateStatus: () => true,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(nodesApi.util.updateQueryData('getAllNodes', undefined, data => {
          data.nodes.push({ id: `producer_${id}`, type: 'PRODUCER' })
        }))
        await queryFulfilled
      },
    }),
    getAllNodes: builder.query<{ nodes: Node[] }, void>({
      providesTags: ['Nodes'],
      queryFn() {
        return { data: { nodes: [
          { type: 'TOPIC', id: 'topic_0' },
          { type: 'CONSUMER', id: 'consumer_0' },
          { type: 'PRODUCER', id: 'producer_0' },
          { type: 'CONSUMER', id: 'consumer_1' },
          { type: 'PRODUCER', id: 'producer_1' },
          { type: 'CONSUMER', id: 'consumer_2' },
          { type: 'PRODUCER', id: 'producer_2' },
          { type: 'CONSUMER', id: 'consumer_3' },
          { type: 'PRODUCER', id: 'producer_3' },
          { type: 'CONSUMER', id: 'consumer_4' },
          { type: 'PRODUCER', id: 'producer_5' },
        ] } }
      },
      async onCacheEntryAdded(_, { cacheEntryRemoved, cacheDataLoaded, dispatch }) {
        const { data: { nodes } } = await cacheDataLoaded
        const ids = nodes.slice(0).reverse().filter(node => node.type === 'CONSUMER')?.map(({ id }) => id)
        const listener = (event: MessageEvent) => {
          const message = JSON.parse(event.data)
          const { From: from, To: to, Message: data, Timestamp: timestamp } = message
          
          ids.forEach(id => dispatch(messagesApi.util.updateQueryData('getMessage', undefined, messages => {
            messages.push({
              id: getMessageId(),
              from: 'topic_0',
              timestamp: Date.now(),
              data: `from ${from}: ${data}`,
              to: to
            })
          })))
        }
        ids.forEach(id => ws.send(id))
        ws.addEventListener('message', listener)
        await cacheEntryRemoved
        ws.close()
      }
    }),
  }),
})

export const { useGetAllNodesQuery, useCreateConsumerMutation, useCreateProducerMutation } = nodesApi