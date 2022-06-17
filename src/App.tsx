import { Provider, useStore } from 'react-redux'
import { Canvas } from '@react-three/fiber'

import { store } from './store'

import { Nodes } from './components/Nodes'
import { Messages } from './components/Messages'
import { Graph } from './components/Graph'
import { Log } from './components/Log'
import { Controls } from './components/Controls'

function App() {
  return (
    <main className="flex h-full bg-gray-900">
      <div className="flex flex-col w-3/4">
        <Canvas orthographic camera={{ zoom: 80 }} dpr={[1, 2]} className="h-full">
          <Provider store={store}>
            <Nodes />
            <Messages />
          </Provider>
        </Canvas>
        <Provider store={store}>
        <div className="h-1/2 border-gray-800 border-t-2">
          <Graph />
        </div>
        </Provider>
      </div>
      <aside className="flex flex-col w-1/4 p-4 border-gray-800 border-l-2">
      <Provider store={store}>
        <Log />
        <Controls />
        </Provider>
      </aside>
    </main>
  )
}

export default App
