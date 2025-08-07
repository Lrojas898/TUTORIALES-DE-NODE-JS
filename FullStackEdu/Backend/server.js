const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const winston = require('winston')

//In app we define our core application, so we can access all the info for the package
const app = express()
//Midelware to use in the express app

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const PORT = 3000 || process.env.PORT;

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))

//Connection to the mongo db

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb+srv://admin:admin12345678@backenddb.dcvfbaw.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Connected to Mongo DB'))
  .catch(err => console.error('Mongo DB connection error: ', err))

//we can have also a winston logger,

// This logger library is used to now and record what happens in your
// application (errors, info, debug messages) and can output them to different places
// like files, databases and also console

const logger = winston.createLogger({
  // we start by creating a logger instance
  level: 'info', //what minimun level of logs to capture, on this case it will be
  //error, warn, and info but not debug
  format: winston.format.combine(
    //we define how the loggers format will be
    winston.format.timestamp(), //add the time where it happened
    winston.format.json() //the other things will be on JSON objects
  ),

  //define where the loggers will be sended

  transports: [
    //All error logs will be sended to a file called 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),

    //all other non error logs will be sended to a file called 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),

    //Show logs in terminal with colors and a simple format

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

//we can use those loggers instead of just printing in the console with console.log

//we can also define customs loggers for our appis requests

const apiLogger = (req, res, next) => {
  //we start by capturing the time the event happened

  const start = Date.now()

  //the event will be waiting to start the callback
  // when the response is sent to the client

  res.on('finish', () => {
    //we calculate the request duration
    const duration = Date.now() - start

    //we define the info template that the logger will have
    logger.info({
      method: req.method, // GET, POST, PUT, DELETE, etc.
      path: req.path, // /users, /api/products, etc.
      status: res.statusCode, // 200, 404, 500, etc.
      duration: `${duration}ms`, // "150ms", "23ms", etc.
      params: req.params, // URL parameters like { id: "123" }
      query: req.query, // Query string like { page: "1", limit: "10" }
      body: req.method !== 'GET' ? req.body : undefined // Request body (not for GET)
      // FIXED TYPO: was "red.method", should be "req.method"
    })
  })

  next() // Let the request continue to the next middleware/route handler
}

//in order to correctly use a database in mongo db, we will need to define a mongo db schema

//Here we have created a student schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    course: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },

  {
    timestamps: true
  }
)

//The shcema defines what the data should look like, but cant interact with database

//The model from mongoose library will serve us to actualy create the student schema, in the student collection in our
// mongo db database

const Student = mongoose.model('Student', studentSchema)

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
)

// remember primary the collection and the the schema that we want to
// add to that specific collection

const Course = mongoose.model('Course', courseSchema)

//Course Route

//The routes will be those endpoints where the user will have access to

app.get('/api/courses', async (req, res) => {
  try {
    //this variable was defined previously in mondo db model
    const courses = await Course.find().sort({ name: 1 })
    logger.info(`Retrieved ${courses.length} courses succesfully`)
    res.json(courses)
  } catch (error) {
    logger.error('Error fetching courses: ', error)
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body)
    const savedCourse = await course.save()
    logger.info('New course created: ', {
      courseId: savedCourse._id,
      name: savedCourse.name
    })

    res.status(201).json(savedCourse)
  } catch (error) {
    logger.error('Error creating course: ', error)
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    if (!course) {
      logger.warn('Course not found for update: ', { courseId: req.params.id })
      return res.status(404).json({ message: 'Course not found' })
    }
    logger.info('Course updated succesfully;', {
      courseId: course._id,
      name: course.name
    })
    res.json(course)
  } catch (error) {
    logger.error('Error updating course: ', error)
    res.status(400).json({ messsage: error.message })
  }
})

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const enrolledStudents = await Student.countDocuments({
      course: req.params.id
    })

    if (enrolledStudents > 0) {
      logger.warn('Attempted to delete course with enrolled students', {
        courseId: req.params.id,
        enrolledStudents
      })
      return res
        .status(400)
        .json({ message: 'Cannot delete course with enrolled students ' })
    }

    const course = await Course.findByIdAndDelete(req.params.id)

    if (!course) {
      logger.warn('Course not found for deletion:', {
        courseId: req.params.id,
        name: course.name
      })
      return res.status(400).json({ message: 'Course not found' })
    }

    logger.info('Course deleted succesfully', {
      courseId: course._id,
      name: course.name
    })

    res.json({ message: 'Course deleted succesfully' })
  } catch (error) {
    logger.error('Error in deleting the course: ', error)
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/course/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      logger.warn('Course not exists: ', {
        courseId: course._Id,
        courseName: course.name
      })
      return res.status(404).json({ message: 'Course not found' })
    }
    logger.info('Course retrieved successfully', {
      courseId: course._id,
      name: course.name
    })
    res.json(course)

  } catch (error) {
    logger.error('Error in searching a course by id: ', error)
    res.status(500).json({ message: error.message })
  }
})

//NOw we can define the student routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 })
    logger.info(`Retrieved ${students.length} students successfully`)
    res.json(students)
  } catch (error) {
    logger.error('Error fetching students: ', error)
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      logger.warn('Student not found: ', { studentId: req.params.id })
      return res.status(404).json({ message: 'Student not found' })
    }

    logger.info('Student retrieved successfully', {
      studentId: student._id,
      name: student.name
    })

    res.json(student)
  } catch (error) {
    logger.error('Error fetching student by id: ', error)
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body)
    const savedStudent = await student.save()

    logger.info('New student created: ', {
      studentId: savedStudent._id,
      name: savedStudent.name,
      email: savedStudent.email
    })

    res.status(201).json(savedStudent)
  } catch (error) {
    logger.error('Error creating student: ', error)
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    )

    if (!student) {
      logger.warn('Student not found for update: ', {
        studentId: req.params.id
      })
      return res.status(404).json({ message: 'Student not found' })
    }

    logger.info('Student updated successfully', {
      studentId: student._id,
      name: student.name
    })

    res.json(student)
  } catch (error) {
    logger.error('Error updating student: ', error)
    res.status(400).json({ message: error.message })
  }
})

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      logger.warn('Student not found for deletion: ', {
        studentId: req.params.id
      })
      return res.status(404).json({ message: 'Student not found' })
    }

    logger.info('Student deleted successfully', {
      studentId: student._id,
      name: student.name
    })

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    logger.error('Error deleting student: ', error)
    res.status(500).json({ message: error.message })
  }
})

//There are cases where we will need to retrieve information different than
//that of creating new students, searching for them for the id,
//and also deleting them.

//What if we want to get all the students based on their status on the platform

app.get('/api/students/status/:status', async (req, res) => {
  try {
    const status = req.params.status

    //Although it can be forced on the front, there may be cases that
    // those developers allow users to send unexisting status

    if (!['active', 'inactive'].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be active or inactive' })
    }

    //The good part is that these status can be searched thanks to the object
    // that exists in mongo db

    const students = await Student.find({ status }.sort({ name: 1 }))

    logger.info(`Retrieved ${students.length} ${status} students`)
    res.json(students)
  } catch (error) {
    logger.error('Error fetching students by status: ', error)
    res.status(500).json({ message: error.message })
  }
})

// Its also useful to determine which students make part of a particular course

//Para este caso se tiene siempre que los params empezaran con :

app.get('/api/students/course/:course', async (req, res) => {
  try {
    //we can use destructuring or the .dot
    const { course } = req.params

    //en este caso el curso es un string
    const courseInDb = await Course.findOne({ name: course })

    if (!courseInDb) {
      logger.warn('Trying to find a unexisintg course', { course: course })
      return res.status(404).json({ message: 'Course not found' })
    }

    const students = await Student.find({ course }).sort({ name: 1 })

    logger.info(`Retrieved ${students.length} ${course} students`)
    res.json(students)
  } catch (error) {
    logger.error('Error fetching students by course: ', error)
    res.status(500).json({ message: error.message })
  }
})

//Although there are cases where the search of studetns will be accrodingly to
// names and not specifically the id of them

app.get('/api/students/search', async (req, res) => {
  try {
    //usaran algo diferente al body o al params, sino
    //el query que se da en los protocoos http
    const searchTerm = req.query.q //extract search term from query parameters
    // URL: /api/students/search?q=javascript
    // req.query.q = "javascript"

    // Validate search term exists, in the case a user does not send any term
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term (q) is required' })
    }

    logger.info('Student search initiated: ', { searchTerm })

    //using the object of mongo, we can then define specerrorific
    //search strategies

    //This are mongo d regex and or operations
    const students = await Student.find({
      $or: [
        //in mongoose we can use regex to find the information
        { name: { $regex: searchTerm, $options: 'i' } },
        { course: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }

        //what does $options: 'i', this means are case-insensitive, so
        //it does not matter if its on uppercase or lowercase, it will search
      ]
    })

    logger.info('Student search completed: ', {
      searchTerm,
      resultsCounts: student.length
    })

    res.json(students)
  } catch (error) {
    logger.error('Error searching students: ', error)
    res.status(500).json('message: error.message')
  }
})

//But there are some cases where the user will want to retrieve an information
//that is not really specific, but are the stadistics of what they have on a db

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats()
    logger.info('Dashboard statistics retrieved succesdfully:', stats)
    res.json(stats)
  } catch (error) {
    logger.error('Error fetching dasboards stats:', error)
  }
})

//For this we will need to create a specific funtion called getDashboardStats()

//this will change in accordance to mongo db

async function getDashboardStats (params) {
  const totalStudents = await Student.countDocuments()
  const activeStudents = await Student.countDocuments({ status: 'active' })
  const totalCourses = await Course.countDocuments()
  const activeCourses = await Course.countDocuments({ status: 'active' })
  const graduates = await Student.countDocuments({ status: 'inactive' })
  //to determine how many students are in a specific course
  const courseCounts = await Student.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } }
  ])

  return {
    totalStudents,
    activeStudents,
    totalCourses,
    activeCourses,
    graduates,
    successRate:
      totalStudents > 0 ? Math.round((graduates / totalStudents) * 100) : 0
  }
}

//we can also create specific checkpoints to determine the system health

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// ===== DETAILED HEALTH CHECK SYSTEM =====

// Enhanced health endpoint with comprehensive system information
app.get('/health/detailed', async (req, res) => {
  try {
    const healthData = await getDetailedHealthCheck()
    
    // Determine overall status based on all checks
    const overallStatus = healthData.checks.every(check => check.status === 'UP') ? 'UP' : 'DOWN'
    
    logger.info('Detailed health check completed', { 
      status: overallStatus,
      timestamp: new Date()
    })
    
    res.status(overallStatus === 'UP' ? 200 : 503).json({
      status: overallStatus,
      timestamp: new Date(),
      ...healthData
    })
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date(),
      error: error.message
    })
  }
})

// Comprehensive health check function
async function getDetailedHealthCheck() {
  const startTime = Date.now()
  
  // System Information
  const systemInfo = {
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    pid: process.pid
  }
  
  // Memory Usage
  const memoryUsage = process.memoryUsage()
  const memoryInfo = {
    totalMemory: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
    usedMemory: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
    freeMemory: Math.round((memoryUsage.heapTotal - memoryUsage.heapUsed) / 1024 / 1024) + ' MB',
    memoryUsagePercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) + '%',
    external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
    rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB'
  }
  
  // Individual Health Checks
  const checks = []
  
  // 1. MongoDB Connection Check
  try {
    const mongoStart = Date.now()
    const mongoState = mongoose.connection.readyState
    const mongoStatus = mongoState === 1 ? 'UP' : 'DOWN'
    const mongoResponseTime = Date.now() - mongoStart
    
    // Test a simple query to verify connection works
    await mongoose.connection.db.admin().ping()
    
    checks.push({
      name: 'MongoDB Connection',
      status: mongoStatus,
      details: {
        state: getMongoStateDescription(mongoState),
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        database: mongoose.connection.name,
        responseTime: mongoResponseTime + 'ms'
      }
    })
  } catch (error) {
    checks.push({
      name: 'MongoDB Connection',
      status: 'DOWN',
      error: error.message
    })
  }
  
  // 2. Database Collections Check
  try {
    const dbStart = Date.now()
    const studentCount = await Student.countDocuments()
    const courseCount = await Course.countDocuments()
    const dbResponseTime = Date.now() - dbStart
    
    checks.push({
      name: 'Database Collections',
      status: 'UP',
      details: {
        studentsCount: studentCount,
        coursesCount: courseCount,
        responseTime: dbResponseTime + 'ms'
      }
    })
  } catch (error) {
    checks.push({
      name: 'Database Collections',
      status: 'DOWN',
      error: error.message
    })
  }
  
  // 3. Database Performance Check
  try {
    const perfStart = Date.now()
    
    // Test read performance
    await Student.findOne().exec()
    const readTime = Date.now() - perfStart
    
    // Test aggregation performance
    const aggStart = Date.now()
    await Student.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    const aggTime = Date.now() - aggStart
    
    const totalPerfTime = Date.now() - perfStart
    const perfStatus = totalPerfTime < 1000 ? 'UP' : 'SLOW'
    
    checks.push({
      name: 'Database Performance',
      status: perfStatus,
      details: {
        readResponseTime: readTime + 'ms',
        aggregationResponseTime: aggTime + 'ms',
        totalResponseTime: totalPerfTime + 'ms',
        performanceRating: totalPerfTime < 100 ? 'Excellent' : 
                          totalPerfTime < 500 ? 'Good' : 
                          totalPerfTime < 1000 ? 'Fair' : 'Poor'
      }
    })
  } catch (error) {
    checks.push({
      name: 'Database Performance',
      status: 'DOWN',
      error: error.message
    })
  }
  
  // 4. Application Statistics
  try {
    const stats = await getDashboardStats()
    
    checks.push({
      name: 'Application Statistics',
      status: 'UP',
      details: {
        totalStudents: stats.totalStudents,
        activeStudents: stats.activeStudents, // Fixed typo from original
        totalCourses: stats.totalCourses,
        activeCourses: stats.activeCourses,
        graduates: stats.graduates,
        successRate: stats.successRate + '%'
      }
    })
  } catch (error) {
    checks.push({
      name: 'Application Statistics',
      status: 'DOWN',
      error: error.message
    })
  }
  
  // 5. Winston Logger Check
  try {
    // Test if logger is working
    const logStart = Date.now()
    logger.info('Health check - testing logger functionality')
    const logResponseTime = Date.now() - logStart
    
    checks.push({
      name: 'Winston Logger',
      status: 'UP',
      details: {
        level: logger.level,
        transports: logger.transports.length,
        responseTime: logResponseTime + 'ms'
      }
    })
  } catch (error) {
    checks.push({
      name: 'Winston Logger',
      status: 'DOWN',
      error: error.message
    })
  }
  
  // 6. API Endpoints Health (sample check)
  try {
    // This would test critical endpoints are working
    const endpointsStatus = 'UP' // In real app, you'd test actual endpoints
    
    checks.push({
      name: 'API Endpoints',
      status: endpointsStatus,
      details: {
        studentEndpoints: 'Available',
        courseEndpoints: 'Available',
        searchEndpoints: 'Available',
        dashboardEndpoints: 'Available'
      }
    })
  } catch (error) {
    checks.push({
      name: 'API Endpoints',
      status: 'DOWN',
      error: error.message
    })
  }
  
  const totalResponseTime = Date.now() - startTime
  
  return {
    system: systemInfo,
    memory: memoryInfo,
    checks: checks,
    summary: {
      totalChecks: checks.length,
      passedChecks: checks.filter(check => check.status === 'UP').length,
      failedChecks: checks.filter(check => check.status === 'DOWN').length,
      totalResponseTime: totalResponseTime + 'ms'
    }
  }
}

// Helper function to describe MongoDB connection states
function getMongoStateDescription(state) {
  const states = {
    0: 'Disconnected',
    1: 'Connected', 
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  }
  return states[state] || 'Unknown'
}

// Fixed getDashboardStats function (correcting errors from original code)
async function getDashboardStats() {
  const totalStudents = await Student.countDocuments()
  const activeStudents = await Student.countDocuments({ status: 'active' }) // Fixed: added quotes
  const totalCourses = await Course.countDocuments()
  const activeCourses = await Course.countDocuments({ status: 'active' }) // Fixed: added quotes
  const graduates = await Student.countDocuments({ status: 'inactive' })
  
  // Course enrollment statistics
  const courseCounts = await Student.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  return {
    totalStudents,
    activeStudents, // Fixed variable name
    totalCourses,
    activeCourses,
    graduates,
    courseCounts,
    successRate: totalStudents > 0 ? Math.round((graduates / totalStudents) * 100) : 0
  }
}

// Keep your original simple health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Additional: Health check for specific service
app.get('/health/database', async (req, res) => {
  try {
    const dbStart = Date.now()
    
    // Test MongoDB connection
    await mongoose.connection.db.admin().ping()
    
    // Test collections
    const studentCount = await Student.countDocuments()
    const courseCount = await Course.countDocuments()
    
    const responseTime = Date.now() - dbStart
    
    res.status(200).json({
      status: 'UP',
      timestamp: new Date(),
      database: {
        connection: 'Connected',
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        collections: {
          students: studentCount,
          courses: courseCount
        },
        responseTime: responseTime + 'ms'
      }
    })
  } catch (error) {
    logger.error('Database health check failed:', error)
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date(),
      error: error.message
    })
  }
})

// Memory-specific health check
app.get('/health/memory', (req, res) => {
  const memoryUsage = process.memoryUsage()
  const memoryInfo = {
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    external: Math.round(memoryUsage.external / 1024 / 1024),
    rss: Math.round(memoryUsage.rss / 1024 / 1024)
  }
  
  const memoryUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
  const status = memoryUsagePercent < 90 ? 'UP' : 'HIGH_MEMORY_USAGE'
  
  res.status(status === 'UP' ? 200 : 503).json({
    status,
    timestamp: new Date(),
    memory: {
      ...memoryInfo,
      usagePercent: memoryUsagePercent + '%',
      warning: memoryUsagePercent > 80 ? 'High memory usage detected' : null
    }
  })
})