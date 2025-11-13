from fastapi import FastAPI, HTTPException, Response, Request
import uvicorn
from pydantic import BaseModel
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

try:
  conn = psycopg2.connect(
    dbname='finance',
    host='localhost',
    port=5432,
    password='KlyarSkenz',
    user='postgres'
  )
  print("✅ Успешное подключение к БД")
except Exception as e:
  print(f"❌ Ошибка подключения к БД: {e}")
  exit(1)

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_credentials=True,
  allow_headers=["*"],
  allow_methods=["*"]
)


class BodyPersonForReg(BaseModel):
  phone: str
  last_name: str
  first_name: str
  middle_name: Optional[str] = None
  password: str


class BodyPersonForEnter(BaseModel):
  phone: str
  password: str


@app.post("/reg")
async def reg(body: BodyPersonForReg, response: Response):
  with conn.cursor() as cur:
    cur.execute("SELECT * FROM users WHERE phone=%s;", (body.phone,))
    user = cur.fetchone()
    if user:
      raise HTTPException(status_code=409, detail="Такой пользователь уже есть")
    cur.execute("INSERT INTO users(phone, last_name, first_name, middle_name, password_hash) VALUES(%s, %s, %s, %s, %s);", 
                (body.phone, body.last_name, body.first_name, body.middle_name, body.password))
    conn.commit()
  response.set_cookie("phone", body.phone, httponly=True, samesite="lax", secure=False)
  response.set_cookie("password", body.password, httponly=True, samesite="lax", secure=False)
  return {"detail": "Вы успешно зарегестрировались"}


@app.post("/enter")
async def enter(body: BodyPersonForEnter, response: Response):
  with conn.cursor() as cur:
    cur.execute("SELECT * FROM users WHERE phone=%s AND password_hash=%s;", (body.phone, body.password))
    user = cur.fetchone()
    if not user:
      raise HTTPException(status_code=409, detail="Неверный логин или пароль")
  response.set_cookie("phone", body.phone, httponly=True, samesite="lax", secure=False)
  response.set_cookie("password", body.password, httponly=True, samesite="lax", secure=False)
  return {"detail": "Вы успешно вошли"}


@app.get("/me")
async def me(request: Request):
  try:
    phone = request.cookies["phone"]
    password = request.cookies["password"]
    with conn.cursor() as cur:
      cur.execute("SELECT first_name, last_name, middle_name FROM users WHERE phone=%s AND password_hash=%s;", (phone, password))
      user = cur.fetchone()
      if not user:
        raise HTTPException(status_code=404, detail="Такого пользователя не существует")
    first_name = user[0]
    last_name = user[1]
    middle_name = user[2]
    return {"phone": phone, "first_name": first_name, "last_name": last_name, "middle_name": middle_name}
  except:
    raise HTTPException(status_code=404, detail="Вы не в аккаунте")


@app.delete("/exit")
async def exit_user(response: Response):
  response.delete_cookie("phone")
  response.delete_cookie("password")
  return {"detail": "Вы успешно вышли из аккаунта"}


if __name__ == '__main__':
  uvicorn.run("main:app", reload=True)
