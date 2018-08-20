const express = require('express')
const http = require('https')
const router = express.Router()

// declare axios for making http requests
const axios = require('axios')
const API = 'https://jsonplaceholder.typicode.com'

/* GET api listing. */
router.get('/place', (req, res) => {
  res.send('api works')
})

// Get all posts
router.post('/places', function (req, res, next) {
	console.log(req.body)
  // let keyword = req.body.keyword
  // let distance = req.body.distance
  // let category = req.body.category

  let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.022352,-118.285117&'
  url = url + 'radius=' + distance + '&type=usc&keyword=' + keyword + '&key=AIzaSyC2ToTji0g2xZTIBSndY9fXWGS8EhL4X5A'
  res.send(url)

  axios.get(url)
    .then(places => {
      console.log('-============-')
      res.status(200).json(places.data)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router
