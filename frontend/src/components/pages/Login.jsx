import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InputAuth from '../forAuth/InputAuth'

const Login = ({ setIsEnter }) => {

  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const phoneRef = useRef()
  const passwordRef = useRef()
  
  const log = async (dataUser) => {
    try{
      if(!dataUser.phone || !dataUser.password){
        alert('Введите все данные!')
        return
      }

      const response = await axios.post('http://localhost:8000/enter', {
        phone: dataUser.phone,
        password: dataUser.password
      })

      setIsEnter(response.status === 200)
      alert('Вы вошли в аккаунт!')
      navigate('/')
    } catch (error){
      if(error.response?.status === 422){
        alert('Введите корректный номер телефона!')
        return
      } else if (error.response?.status === 404){
        alert('Пользователя с такими данными не существует!')
        return
      } else {
        alert('Ошибка ', (error.response?.data?.message || error.message))
      }
      setIsEnter(false)
    }
  }



  return(
    <div>
      <h1>Вход</h1>
      <InputAuth ref={phoneRef} type="text" placeholder="Телефон" /><br/>
      <InputAuth ref={passwordRef} type="password" placeholder="Пароль" /><br/>
      <button onClick={() => {
        const dataUser = {
          phone: phoneRef.current.value,
          password: passwordRef.current.value
        }
        log(dataUser)
      }}>
        Войти
      </button>
      <button onClick={() => navigate('/')}>На главную</button>
    </div>
  )
}

export default Login