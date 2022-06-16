import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Message {
  id: number
  timestamp: number
  from: number
  to: number[]
  data: string
}

let id = 0;
const MAX_MESSAGES = 1000;

const getRandomNodes = () => {
  const from = Math.round(Math.random() * 5)
  let toSet = new Set([
    Math.round(Math.random() * 5),
    Math.round(Math.random() * 5),
    Math.round(Math.random() * 5)
  ])
  toSet.delete(from)
  const to = Array.from(toSet)
  return { from, to }
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessage: builder.query<Message[], void>({
      queryFn() {
        return { data: new Array(MAX_MESSAGES) }
      },
      providesTags: ['Message'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded
        const interval = setInterval(() => {
          updateCachedData(messages => {
            const { from, to } = getRandomNodes()
            const timestamp = Date.now()
            messages.push({ from, to, id: id++, timestamp: Date.now(), data: Math.random().toString() })
            if (messages.length > MAX_MESSAGES * 2) {
              messages.splice(0, messages.length - MAX_MESSAGES)
            }
          })
        }, 1000)
        await cacheEntryRemoved
        clearInterval(interval)

        // const ws = new WebSocket('ws://localhost:8080')
        // try {
        //   await cacheDataLoaded
        //   const listener = (event: MessageEvent) => {
        //     const data = JSON.parse(event.data)
        //     updateCachedData((draft) => {
        //       draft.push(data)
        //     })
        //   }
        //   ws.addEventListener('message', listener)
        // } catch {}
        // await cacheEntryRemoved
        // ws.close()
      }
    }),
    sendMessage: builder.mutation<void, Omit<Message, 'id' | 'timestamp'>>({
      queryFn() {
        return { data: undefined }
      },
      async onQueryStarted({ from, to, data }, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(messagesApi.util.updateQueryData('getMessage', undefined, messages => {
          messages.push({ from, to, data, id: id++, timestamp: Date.now() })
          if (messages.length > MAX_MESSAGES * 2) {
            messages.splice(0, messages.length - MAX_MESSAGES)
          }
        }))
      }
    })
  })
})

export const { useGetMessageQuery, useSendMessageMutation } = messagesApi