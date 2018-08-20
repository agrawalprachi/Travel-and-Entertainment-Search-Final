import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, ApplicationRef} from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as moment from 'moment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';

declare var window: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  animations: [

    trigger('slide', [
      state('left', style({ position: 'absolute', transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-'+window.outerWidth.toString()+'px)' })),
      transition('right => left', animate("350ms ease-in"))
    ])

  ]
})

export class DetailsComponent implements OnInit {

 
 @Input() place_details: any = [];
 @Input() favoriteList: any = [];
 @ViewChild("locfrom") locelemfrom : ElementRef;
 @Output() backToList:any = new EventEmitter<any>();
 @Output() listClicked = new EventEmitter();
 @Input() mapJsonObject;
 @Input() activePaneInp = 'right';
 @Input() placesInternal: any = [];

 activePane = 'right';

 private openNow: number = 0;
 private info: boolean = true;
 private photos: boolean = false;
 private map: boolean = false; 
 private reviews: boolean = false;
 private photoarray: any = [];
 private pegman: boolean = true;
 private review;
 private order;
 private googleReviews: boolean = true;
 private yelpReviews: boolean = false;
 private reviewsList: any =[];
 private yelpReviewsList: any = [];
 private twitterPostUrl: any = "";
 private priceLevel: any = [];
 private rating: any = [];
 private showDialog = false;
 private weekdayText: any = [];
 private totalCols: any = [];
 private halfRows: any = [];
 private fullRows: any = [];
 private photoColumn1: any = [];
 private photoColumn2: any = [];
 private photoColumn3: any = [];
 private photoColumn4: any = [];
 private setDisableDirection: boolean = false;
 private noPhotos: boolean = false;
 private noGoogleReviews: boolean = false;
 private noYelpReviews: boolean = false;
 private defaultYelp: any = [];
 private defaultGoogle: any = [];
 private reviewButtonText: string = 'Google Reviews';
 private orderButtonText: string = 'Default Order';
 private favPlacesList: any = [];
 @Input() displayFav: boolean = true;
 @Input() displayResult: boolean = true;



 mapfields = {
  'mode': 'DRIVING',
  'from' : null
 };

  directionsDisplay = null;
  directionsService = null;
  mapObject = null;
  marker = null;

 @ViewChild("mapDiv") mapdiv: ElementRef;
 @ViewChild("mapPanel") mappanel: ElementRef;

 constructor(private http: Http, private appRef: ApplicationRef){
	  	   
   }

  ngOnInit() {
      setTimeout(()=>{this.activePane='left';});
      if(this.place_details.hasOwnProperty('opening_hours'))
      {
          if (this.place_details.opening_hours.open_now == true){
          this.openNow = 1;
          }
          else
          {
            this.openNow = 2;
          }
      }
      
      this.review = "google_reviews";
      this.order = "default_order";
      let text;
      if(this.place_details.website)
      {
      text = "Check out " + this.place_details.name + " located at " +  this.place_details.formatted_address + ".  Website: " + this.place_details.website + " #TravelAndEntertainmentSearch";    
      }

      else
      {
       text = "Check out " + this.place_details.name + " located at " +  this.place_details.formatted_address + ".  Website: " + this.place_details.url + " #TravelAndEntertainmentSearch";
      }

      this.twitterPostUrl =  "http://twitter.com/intent/tweet?text=" +  encodeURIComponent(text);
      

      this.priceLevel = Array(this.place_details.price_level).fill(4);
      let roundedRating = this.place_details.rating ? Math.floor(this.place_details.rating): 0;
      this.rating = Array(roundedRating).fill(4);

      if(this.place_details.hasOwnProperty('opening_hours'))
        for(let time of this.place_details.opening_hours.weekday_text)
        {
          let t = time.split(": ");
          this.weekdayText.push({"day":t[0], "time":t[1]});
        }

      if(!this.mapJsonObject["fromText"])
      {
        
        this.mapfields.from = "Your Location"
      }
          
      else
      {
        this.mapfields.from = this.mapJsonObject["fromText"];
      }


      this.fetchYelpReviews();


        this.favPlacesList = JSON.parse(localStorage.getItem('favItems'));
            if (this.favPlacesList.length != 0) {
                for ( let p of this.favPlacesList) {
                    if ( p.place_id == this.place_details.place_id) {
                        this.place_details.star = true;
                  }
              }
        }

  }

  tweet()
  {
    window.open(this.twitterPostUrl, "Popup", "location,status,scrollbars,resizable,width=800, height=800");
  }	  
  fetchYelpReviews(){
    let name = this.place_details.name;
      let address = this.place_details.formatted_address;
      let country;
      let state;
      let city;
      
        for(let comp of this.place_details.address_components){
            if(comp.types.indexOf("country") >= 0)
              country = comp.short_name;
            else if(comp.types.indexOf("administrative_area_level_1") >= 0)
               state = comp.short_name;
            else if(comp.types.indexOf("administrative_area_level_2") >= 0)
               city = comp.short_name;     
        }
           
        let body = JSON.stringify({
                      "name": name,
                      "city": city,
                      "state": state,
                      "country": country,
                      "address": address
        });
        
        this.getYelpReviews(body).subscribe(data => {

              if(data.reviews.length>0){
                this.yelpReviewsList = data.reviews;
                this.defaultYelp = Object.assign([], data.reviews);
                
              }
        });
  }

  displayInfo(){
  	this.photos = false;
  	this.map = false;
  	this.reviews = false;
  	this.info = true;
  }

  displayPhotos(){
  	this.photos = true;
  	this.map = false;
  	this.reviews = false;
  	this.info = false;

    let index: number = 1;

    if(this.place_details.hasOwnProperty('photos')){
      let totalPhotos = this.place_details.photos.length;
      this.noPhotos = false;
        for(let photo of this.place_details.photos){
            let photoUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=" + photo.width + "&photoreference=" + photo.photo_reference +"&key=AIzaSyDWb6pIz_cheXM36HbUUDiOwTMLhn8_TPQ";
            
            if(index%4 == 1)
              this.photoColumn1.push(photoUrl);
            if(index%4 == 2)
              this.photoColumn2.push(photoUrl);
            if(index%4 == 3)
              this.photoColumn3.push(photoUrl);
            if(index%4 == 0)
              this.photoColumn4.push(photoUrl);

            index += 1;
        }
    }
    else{
    this.noPhotos = true;
    }
  	

  }

  displayMap(){
    
    this.pegman = true;
    let autocomplete = new google.maps.places.Autocomplete(this.locelemfrom.nativeElement, {
        types: ['address']
      });

  	this.photos = false;
  	this.map = true;
  	this.reviews = false;
  	this.info = false;

    var place = {lat: this.place_details.geometry.location.lat, lng: this.place_details.geometry.location.lng};
    
    this.mapObject = new google.maps.Map(this.mapdiv.nativeElement, {
      zoom: 13,
      center: place
    });

    this.marker = new google.maps.Marker({
      position: place,
      map: this.mapObject

    });


    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay.setMap(this.mapObject);
    this.directionsDisplay.setPanel(this.mappanel.nativeElement);
  	
  }

  showStreetView(){
    this.pegman = false;

    var place = {lat: this.place_details.geometry.location.lat, lng: this.place_details.geometry.location.lng};

    var panorama = new google.maps.StreetViewPanorama(
      this.mapdiv.nativeElement, {
        position: place,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
    this.mapObject.setStreetView(panorama);
  
  }

  displayReviews(){
  	this.photos = false;
  	this.map = false;
  	this.reviews = true;
  	this.info = false;

    if (this.review == "google_reviews")
    {
        this.googleReviews = true;
        this.yelpReviews = false;

        if(this.place_details.hasOwnProperty('reviews')){
            this.reviewsList = this.place_details.reviews;
            this.defaultGoogle = Object.assign([], this.place_details.reviews);;
            this.noGoogleReviews = false;
        }
        else
        {
          this.noGoogleReviews = true;
        }

        this.sortReviews();
        
    }

    
    if (this.review == "yelp_reviews")
    {
      
      this.yelpReviews = true;
      this.googleReviews = false;

        this.sortReviews();
    }


  }

  sortReviews(){

  if (this.review == "google_reviews")
    {
  
        if (this.order == "highest_rating")
        {

            this.reviewsList.sort(function(review1, review2){
            return review1.rating < review2.rating;
            });

        }

        if (this.order == "lowest_rating")
        {
            
            this.reviewsList.sort(function(review1, review2){
            return review1.rating > review2.rating;
            });
        }

        if (this.order == "most_recent")
        {
            this.reviewsList.sort(function(review1, review2){
            return review1.time < review2.time;
            });
        }

        if (this.order == "least_recent")
        {
            this.reviewsList.sort(function(review1, review2){
            return review1.time > review2.time;
            });
        }

        if (this.order == "default_order")
        {
            this.reviewsList = this.defaultGoogle ;                
        }

    }

    if (this.review == "yelp_reviews"){

        if(this.yelpReviewsList.length == 0)
        {
          this.noYelpReviews = true;
        }
        else
        {
          this.noYelpReviews = false;
        }

        if (this.order == "highest_rating")
        {

            this.yelpReviewsList.sort(function(review1, review2){
            return review1.rating < review2.rating;
            });

        }

        if (this.order == "lowest_rating")
        {
            
            this.yelpReviewsList.sort(function(review1, review2){
            return review1.rating > review2.rating;
            });
        }

         if (this.order == "most_recent")
        {
            this.yelpReviewsList.sort(function (review1, review2) {
                if (moment(review1.time_created).isAfter(review2.time_created)) {
                  return -1;
                } else if (moment(review2.time_created).isAfter(review1.time_created)) {
                  return  1;
                } else {
                  return 0;
                }
            });
        }

        if (this.order == "least_recent")
        {

            this.yelpReviewsList.sort(function (review1, review2) {
                if (moment(review1.time_created).isAfter(review2.time_created)) {
                  return 1;
                } else if (moment(review2.time_created).isAfter(review1.time_created)) {
                  return -1;
                } else {
                  return 0;
                }
            });
        }

        if (this.order == "default_order")
        {
            this.yelpReviewsList = this.defaultYelp ;                
        }



    }

  }

  getYelpReviews(body){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let yelpUrl = "http://hw8-prachi-env.us-east-1.elasticbeanstalk.com/web-api/yelp-reviews";
    return this.http.post(yelpUrl, body, { headers: headers })
      .map(res => res.json());
  }


  getDirections(){

    let val = this.locelemfrom.nativeElement.value;

    if(val == "Your Location")
    {
      val = {lat: this.mapJsonObject["lat"], lng: this.mapJsonObject["lon"]};
    }
    if(val == "My location")
    {
      val = {lat: this.mapJsonObject["lat"], lng: this.mapJsonObject["lon"]};
    }

    
    this.directionsService.route({
      origin: val,
      destination: {lat: this.place_details.geometry.location.lat, lng: this.place_details.geometry.location.lng},
      travelMode: this.mapfields.mode,
      provideRouteAlternatives: true
    }, function(response, status) {
      if (status == 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
      }
    }.bind(this));



  }



  showMapView(){
  	this.pegman = true;

  }

  addFavorite(place) {
    place.star = typeof place.star == 'undefined' ? true: !place.star;
    if (!this.favoriteList.find(function(a) {return a.place_id == place.place_id;})){
      place.star = true;
      this.favoriteList.push(place);
    }

    localStorage.setItem("favItems", JSON.stringify(this.favoriteList));
    this.appRef.tick();

  }

  removeFavorite(place) {
    place.star = !place.star; 
    this.favoriteList = this.favoriteList.filter((value) => value.place_id != place.place_id);
    localStorage.setItem("favItems", JSON.stringify(this.favoriteList));
    
    let temp: any = [];
    for(let p of this.placesInternal){
      
      if(p.place_id == place.place_id)
      {
        p.star = false;
      }
            
      temp.push(p);
    }

    this.placesInternal = temp;       

  }


  postOnTwiiter(){

  }

  openDialog(){
    this.showDialog = true;
  }

  closeDialog(){
    this.showDialog = false;
  }

  showList(e)
  {
    this.listClicked.emit();
    this.backToList.emit("back");
  }

  checkFrom(){
    if (!this.mapfields.from.replace(/\s/g, '').length) {
            this.setDisableDirection =  true;
      }

      else
      {
        this.setDisableDirection =  false;
      }
  }

}
