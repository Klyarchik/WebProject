import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import Reg from './components/pages/Reg'
import Home from './components/pages/Home'
import Login from './components/pages/Login'


const App = () => { 

  const location = useLocation() 
  const [isEnter, setIsEnter] = useState(false)
  const [currentPhone, setCurrentPhone] = useState("")


  useEffect(() => {
    const isEnterFunc = async () => {
      try{
        const response = await axios.get('http://localhost:8000/me')
        console.log('response: ', response)
        setIsEnter(response.status === 200)
        setCurrentPhone(response.data.phone)
      } catch(error){
        if(error.response?.status === 403 || error.response?.status === 404){
          return
        }
        setIsEnter(false)
      }
    }
    isEnterFunc()
  }, [location.pathname])




  return(
    <div>
      <Routes>

        <Route path='/' element={
          <Home 
            isEnter={isEnter}
            currentPhone={currentPhone}
          />} 
        />
        <Route path='/register' element={
          <Reg 
            setIsEnter={setIsEnter} 
          />} 
        />
        <Route path='/login' element={
          <Login 
            setIsEnter={setIsEnter} 
          />} 
        />

      </Routes>
    </div>
  )
  
}

export default App