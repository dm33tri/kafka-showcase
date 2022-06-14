import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export type Node = {
  id: number
}

export const nodesApi = createApi({
  reducerPath: 'nodesApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllNodes: builder.query<Node[], void>({
      queryFn() {
        return { data: [
          { id: 0 },
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ] }
      }
    }),
  }),
})

export const { useGetAllNodesQuery } = nodesApi