const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login</title>
        </head>
        <body>
            <h2>Login Form</h2>
            <form action="/login" method="POST">
                <label for="username">Username:</label><br>
                <input type="text" id="username" name="username" required><br><br>
                
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password" required><br><br>
                
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `)
})

function generateAccessToken (user) {
  //pide un payload, y una secret key para encriptar la informacion
  return jwt.sign(user)
}

app.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log('Login attempt:', { username, password })

  //consultar en la db y validar que existe, tanto username como password

  //simulemos que en este caso se ha podido recuperar correctamente el usuario

  const user = { username: username }

  //para este token solo se efecuta con base al username
  const accessToken = generateAccessToken(user, process.env.SECRET, {
    expriesIn: '5m'
  })

  //pero se puede guardar cualquier tipo de informacion adicional

  res.header('authorization', accessToken).json({
    message: 'Usuario autenticado',
    token: token
  })
})

app.listen(3000, () => {
  console.log('Server initializing on port 3000')
})
