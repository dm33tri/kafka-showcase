import { Provider } from 'react-redux'
import { Canvas } from '@react-three/fiber'

import { store } from './store'

import { Nodes } from './components/Nodes'
import { Messages } from './components/Messages'
import { Graph } from './components/Graph'

function App() {
  return (
    <Canvas orthographic camera={{ zoom: 80 }} dpr={[1, 2]}>
      <Provider store={store}>
        <Nodes />
        <Messages />
        <Graph />
      </Provider>
    </Canvas>
  )
}

export default App
