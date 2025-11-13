import { useNavigate } from "react-router-dom"
import Header from "../forHome/Header"


const Home = ({ isEnter, setIsEnter, currentPhone }) => {
  
  const navigate = useNavigate()
  
  return(
    <div>
      <h1>Главная</h1>
      <Header currentPhone={currentPhone} />
      {!isEnter && 
        <div>
          <button onClick={() => navigate('/login')}>Войти</button>
          <button onClick={() => navigate('/register')}>Зарегистрироваться</button>  
        </div>
      }
    </div>

  )
}

export default Home