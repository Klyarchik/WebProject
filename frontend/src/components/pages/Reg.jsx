import { useRef, useState } from "react"
import { data, useNavigate } from 'react-router-dom'
import InputAuth from "../forAuth/InputAuth"

import axios from 'axios'

const Reg = ({ setIsEnter }) => {

  axios.defaults.withCredentials = true

  const navigate = useNavigate()

  const phoneRef = useRef()
  const lastNameRef = useRef()
  const firstNameRef = useRef()
  const middleNameRef = useRef()
  const passwordRef = useRef()
  const returnPasswordRef = useRef()

  const [validPassword, setValidPassword] = useState(false)
  
  const handlePasswordChange = () => {
    validatePassword()
  }


  const validatePassword = () => {
    if(passwordRef.current.value.length < 8 || passwordRef.current.value.length > 10){
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }
  }

  const regUser = async (dataUser) => {
   
    if(!dataUser.phone || !dataUser.lastName || !dataUser.firstName || !dataUser.password) {
      alert('Введите все данные!')
      return
    }

    if (dataUser.password !== returnPasswordRef.current.value) {
      alert('Пароли не совпадают!')
      return
    }


    try{
      const response = await axios.post('http://localhost:8000/reg', {
        phone: dataUser.phone,
        last_name: dataUser.lastName,
        first_name: dataUser.firstName,
        middle_name: dataUser.middleName,
        password: dataUser.password
      })

      console.log('response: ', response)
      alert('Вы успешно зарегистрировались!')
      setIsEnter(response.status === 200)
      navigate('/')
    } catch (error){
      alert('Ошибка авторизации\n ', (error.response?.data?.message || error.message))
      setIsEnter(false)
    }
  }


  return(
    <div>
      <h1>Регистрация</h1>

      <InputAuth ref={phoneRef} type="text" placeholder="Телефон*" /><br />
      <InputAuth ref={lastNameRef} type="text" placeholder="Фамилия*" /><br />
      <InputAuth ref={firstNameRef} type="text" placeholder="Имя*" /><br />
      <InputAuth ref={middleNameRef} type="text" placeholder="Отчество" /><br />
      <InputAuth ref={passwordRef} type="password" placeholder="Пароль*" onChange={handlePasswordChange}/><br />
      {validPassword && <div style={{color: "red"}}>Пароль должен быть от 8 до 10 символов!</div>}
      <InputAuth ref={returnPasswordRef} type="password" placeholder="Повторите пароль*" /><br />

      <button onClick={() => {
        const dataUser = {
          phone: phoneRef.current.value,
          lastName: lastNameRef.current.value,
          firstName: firstNameRef.current.value,
          middleName: middleNameRef.current.value,
          password: passwordRef.current.value
        }
        regUser(dataUser)
      }}>
        Зарегистрироваться
      </button><br />

      <button onClick={() => navigate('/')}>На главную</button>

    </div>
  )

}

export default Reg