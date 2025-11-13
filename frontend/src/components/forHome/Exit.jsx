import axios from "axios"
import { useNavigate } from "react-router-dom"

const Exit = ({ setIsEnter }) => {

  const navigate = useNavigate()

  const exit = async () => {
    try{
      const response = await axios.delete('http://localhost:8000/exit')
      setIsEnter(false)
      alert('Вы вышли из аккаунта')
      navigate('/')
    } catch(error){
      alert('Ошибка при выходе из аккаунта ', (error.response?.data?.message || error.message))
    }
  }

  return(
    <div>
      <button onClick={() => exit()}>Выйти из аккаунта</button>
    </div>
  )
}

export default Exit