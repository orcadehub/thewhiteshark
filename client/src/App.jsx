import { useState } from 'react'
import LOGO from './assets/brand-image.png'
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>The White Shark</h1>
      <img src={LOGO} alt='Brandlogo' height={150} width={230}/>
      <p className='box'>UNDER MAINTAINANCE</p>
    </>
  )
}

export default App
