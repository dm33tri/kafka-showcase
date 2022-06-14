import { Provider } from 'react-redux'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'

import { Nodes } from './components/Nodes'
import { Messages } from './components/Messages'
import { store } from './store'

function App() {
  return (
    <Canvas orthographic camera={{ zoom: 80 }} dpr={[1, 2]}>
      <Provider store={store}>
        <Nodes />
        <Messages />
      </Provider>
    </Canvas>
  )
}

export default App
