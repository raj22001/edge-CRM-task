import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Accordions from './components/custom/Accordions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div>
      <Accordions />
    </div>
    </>
  )
}

export default App
