const axios = require('axios')
module.exports = {
  /**
   * This is getting the place from the GOOGLE
   */
  places: (req, res) => {

    let keyword = typeof req.body.keyword != 'undefined' ? req.body.keyword : ''
    let distance = typeof req.body.distance != 'undefined' ? req.body.distance : ''
    let category = typeof req.body.category != 'undefined' ? req.body.category : ''
    let lat = typeof req.body.lat != 'undefined' ? req.body.lat : ''
    let lon = typeof req.body.lon != 'undefined' ? req.body.lon : ''

    if ("locationText" in req.body){
       let locationText = typeof req.body.locationText != 'undefined' ? req.body.locationText : ''
       
       let geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationText +
            "&key=AIzaSyB6QjWXXwbhZClTDaXMdrMxgNnS6U6U7r8" ;

        axios.get(geocodeUrl)
          .then(result => {
              lat = result.data.results[0]['geometry']['location']['lat'];
              lon = result.data.results[0]['geometry']['location']['lng'];

              
              let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&'
              url = url + 'radius=' + distance + '&type='+category+'&keyword=' + keyword + '&key=AIzaSyC2ToTji0g2xZTIBSndY9fXWGS8EhL4X5A'

              axios.get(url)
                .then(places => {
                  res.status(200).json(places.data)
                })
                .catch(error => {
                  res.status(500).send(error)
                })
          })
          .catch(error => {
            res.status(500).send(error)
          })

    }
    else{
          let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&'
          url = url + 'radius=' + distance + '&type='+category+'&keyword=' + keyword + '&key=AIzaSyC2ToTji0g2xZTIBSndY9fXWGS8EhL4X5A'

          axios.get(url)
            .then(places => {
              res.status(200).json(places.data)
            })
            .catch(error => {
              res.status(500).send(error)
            })
    }

  },
  /**
   * 
   */

  morePlaces: (req, res) => {
    let page_token = typeof req.body.page_token != 'undefined' ? req.body.page_token : ''
    let morePlacesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=' + page_token + '&key=AIzaSyC2ToTji0g2xZTIBSndY9fXWGS8EhL4X5A'
    

    axios.get(morePlacesUrl)
            .then(places => {
              res.status(200).json(places.data)
            })
            .catch(error => {
              res.status(500).send(error)
            })
  },


  details: (req, res) => {
    let place_id = typeof req.body.place_id != 'undefined' ? req.body.place_id : ''
    let placeDetailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ place_id + "&key=AIzaSyBDo0O3hHdjTW9O-Al_ivQ-wEf5fA4XJvI" ;



    axios.get(placeDetailsUrl)
            .then(details => {
              res.status(200).json(details.data)
            })
            .catch(error => {
              res.status(500).send(error)
            })



  },

  yelpReviews: (req, res) => {
    let name = typeof req.body.name != 'undefined' ? req.body.name : '';
    let city = typeof req.body.city != 'undefined' ? req.body.city : '';
    let state = typeof req.body.state != 'undefined' ? req.body.state : '';
    let country = typeof req.body.country != 'undefined' ? req.body.country : '';
    let address = typeof req.body.address != 'undefined' ? req.body.address : '';

    let url = 'https://api.yelp.com/v3/businesses/matches/best?name=' + encodeURIComponent(name) + '&city=' + encodeURIComponent(city) + '&state=' + encodeURIComponent(state) + '&country=' + encodeURIComponent(country) + '&address1=' + encodeURIComponent(address);
    
    axios.get(url, {
        headers: {'authorization': 'Bearer mRaXTLAiwrfdeWmNYygSx5tjcef1qm5y_ijaIJZXduUjmQ1vK7MUAepRMuJo_LVcW-ZuqCz56TG6Q_TdvXCsYOsBFNsjakT5l23JAp7M7W2y1Cf1O-JQshX9nE3GWnYx'}
      })
      .then((response) => {

          if (response.data.businesses.length == 0) {
              res.status(500).send("zero Results Found");
          }
          let placeId = response.data.businesses[0].id;
          let url = 'https://api.yelp.com/v3/businesses/' + placeId + '/reviews';
          axios.get(url, {
              headers: {'authorization': 'Bearer mRaXTLAiwrfdeWmNYygSx5tjcef1qm5y_ijaIJZXduUjmQ1vK7MUAepRMuJo_LVcW-ZuqCz56TG6Q_TdvXCsYOsBFNsjakT5l23JAp7M7W2y1Cf1O-JQshX9nE3GWnYx'}
            })
            .then(reviews => {
              res.status(200).json(reviews.data);
            })
            .catch(error => {
              res.status(500).send(error);
              
            })
      })
      .catch(error => {
        res.status(500).send(error);
        

      })
  }


}