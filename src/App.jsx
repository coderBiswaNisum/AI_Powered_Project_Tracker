import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage'
import ProjectManagerDashboard from './pages/ProjectManagerDashboard'

function App() {
  const [toggle,setToggle] = useState(true)

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <button className='toggleButton' onClick={()=>setToggle(prev => !prev)}>
      {toggle ?"Toggle Manager Mode" : "Toggle Employee Mode"}
      </button>
    </div>
    {toggle ?<HomePage />:<ProjectManagerDashboard />}
    </>
  )
}

export default App
