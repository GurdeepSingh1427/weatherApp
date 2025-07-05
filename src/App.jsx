import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Weatherapp from './Weatherapp'
import InputSearch from './InputSearch'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='parentdiv'>
      <Weatherapp />
      <InputSearch />
    </div>
  )
}

export default App
