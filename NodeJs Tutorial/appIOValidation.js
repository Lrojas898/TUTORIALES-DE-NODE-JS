const express = require('express') //sirve para usar el framework
const path = require('path') //maneja los paths de las rutas
const Joi = require('joi') //libreria de validación de datos
const bodyParser = require('body-parser') //procesa los datos de formularios
const app = express() //se crea una instancia de express

app.use('/public', express.static(path.join(__dirname, 'static')))

//Middleware para procesar datos de formularios de Html, por el momento
//solo se procesarán datos sencillos no objetos anidados
app.use(bodyParser.urlencoded({ extended: false }))

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'The email has not a valid format',
        'any.required': 'The email is mandatory'
    }),
    password: Joi.string().min(5).max(10).required().messages({
        'string.min': 'the password must have at least 5 characters',
        'string.max': 'the password cannot be more than 10 characters long',
        'any.required': 'the password is mandatory'
    })
})

//aca se puede tener entonces una respuesta para el respectivo get
app.get('/', (req, res) => {
    console.log('Request for a login page')
    res.sendFile(path.join(__dirname, 'static', 'login.html'))
})

app.post('/login', (req, res) => {
    console.log('Post petition received')
    const { error, value } = loginSchema.validate(req.body)
    
    if (error) {
        console.log('Error in validation')
        return res.status(400).json({
            success: false,
            message: 'Data not valid',
            error: error.details[0].message
        });
    }
    
    console.log('Data is valid!')
    const { email, password } = value;
    
    if (email === 'admin@example.com' && password === 'admin123') {
        console.log('Login exitoso');
        return res.json({
            success: true,
            message: 'Login exitoso',
            user: { email: email }
        });
    } else {
        console.log('Credenciales incorrectas');
        return res.status(401).json({
            success: false,
            message: 'Email o contraseña incorrectos'
        });
    }
})

// Fixed: Changed from app.use('*', ...) to app.use(...)
// This catches all unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Pagina no encontrada'
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado exitosamente');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('🛑 Para detener el servidor presiona Ctrl+C');
});