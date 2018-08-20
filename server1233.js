const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')

// Get our API routes
const api = require('./server/routes/api')
const cors = require('cors')

// use it before all route definitions

const app = express()

// Parsers for POST data
// app.use(bodyParser.json({limit: '1024mb'}))
// app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }))

app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb'})); // for parsing the application/x-www-form-urlencode
app.use(bodyParser.json({limit: '1024mb'})) // for parsing the application/json format

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')))
app.use(cors({origin: 'http://localhost:8080'}))
// Set our api routes
// app.use('/', api)

app.get('', (req, res) => {
  res.send('Un Authorized Access...')
})

app.post('/places', function (req, res, next) {
  // console.log(req.body)
  // let keyword = req.body.keyword
  // let distance = req.body.distance
  // let category = req.body.category

  // let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.022352,-118.285117&'
  // url = url + 'radius=' + distance + '&type=usc&keyword=' + keyword + '&key=AIzaSyC2ToTji0g2xZTIBSndY9fXWGS8EhL4X5A'
  // res.send(url)

// axios.get(url)
//   .then(places => {
//     console.log('-============-')
//     res.status(200).json(places.data)
//   })
//   .catch(error => {
//     res.status(500).send(error)
//   })
})

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'))
// })

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8080'
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`))
