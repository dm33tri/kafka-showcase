import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'
import { store } from '../store'
import { nodesApi } from './nodes'

export interface Message {
  id: number
  timestamp: number
  from: string
  to: string
  data: string
}

let id = 0;
const MAX_MESSAGES = 1000;

export const getMessageId = () => id++

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessage: builder.query<Message[], void>({
      queryFn() {
        return { data: [] }
      },
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation<void, void>({
      query: () => 'message',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const timestamp = Date.now()
        const id = getMessageId()
        const { data: nodes } = nodesApi.endpoints.getAllNodes.select()(store.getState())
        if (!nodes) {
          return
        }
        const fromNodes = nodes.filter(node => node.type === 'PRODUCER')
        await queryFulfilled
        dispatch(messagesApi.util.updateQueryData('getMessage', undefined, messages => {
          fromNodes.forEach(({ id: from }) => {
            messages.push({ id, timestamp, from, to: 'topic_0', data: 'test_0' })
          })
        }))
      }
    })
  })
})

export const { useGetMessageQuery, useSendMessageMutation } = messagesApi