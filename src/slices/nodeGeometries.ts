import { RefObject } from "react";
import type { Mesh, BufferGeometry } from "three"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NodeGeometries = {
    [id: string]: RefObject<Mesh<BufferGeometry>>
}

export const nodeGeometriesSlice = createSlice({
    name: 'nodeGeometries',
    initialState: {} as NodeGeometries,
    reducers: {
        setNodeGeometry: (state, action: PayloadAction<{ id: string; ref: RefObject<Mesh<BufferGeometry>> }>) => {
            const { id, ref } = action.payload
            state[id] = ref
        }
    }
})

export const { setNodeGeometry } = nodeGeometriesSlice.actions
