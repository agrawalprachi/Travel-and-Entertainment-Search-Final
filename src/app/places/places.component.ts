import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { PlacesService } from '../places.service';
import { Headers, Http } from '@angular/http';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';


@Component({
	selector: 'app-places',
	templateUrl: './places.component.html',
	styleUrls: ['./places.component.css'],
	providers: [PlacesService],
	animations: [

    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX('+window.outerWidth.toString()+'px)' })),
      transition('right => left', animate("350ms ease-in"))
  	])

  ]
})

export class PlacesComponent implements OnInit {

	private isFavorite: boolean = false;
	private place: any;
	private details;
	private index: number = 0;
	private allPlaces = [];
	private place_id;
	private displayDetails = false;
	private favPlaceIdList: any = []; 
	private highlighted_item: any = '';
	private isVisible: boolean = true;
	private disableDetailBtn: boolean = true;
	@Input() places: any = []; 
	private placesInternal;
	private placeIdDetailBtn: any = 0;
	private nptInternal;
	@Input() displayResult: boolean = true;
	@Input() displayFav: boolean = false;
	@Input() next_page_token: any;
	@Output() triggerButton = new EventEmitter<any>();
	@Input() mapJsonObject;
	@Output() passFavList: EventEmitter<any> = new EventEmitter<any>();


	activePane = 'left';

	constructor(private http: Http) { }

	ngOnInit() { 
		if(localStorage.getItem("favItems"))
			this.favPlaceIdList = JSON.parse(localStorage.getItem("favItems"));
		this.highlighted_item = localStorage.getItem("highlighted_item");
		
		this.placesInternal = JSON.parse(JSON.stringify(this.places));
		this.nptInternal = JSON.parse(JSON.stringify(this.next_page_token));

		
		this.placesInternal.forEach((val)=>{
			if(this.favPlaceIdList.find(function(a) {
				return a.place_id == val.place_id;
			})) {
				val.star = true;
			}
		});

		this.passFavList.emit(this.favPlaceIdList);


	}



	toggleFavorite(){
		if(this.isFavorite)
		{
			this.isFavorite  = false;
		}
		else
		{
			this.isFavorite = true;
		}
	}


	searchMorePlaces() {	

		if(this.nptInternal)
		{
			this.getMoreData().subscribe(data => {
			
				if (data.status == "OK") {
					this.allPlaces[this.index]=this.placesInternal;
					this.index += 1;
					this.placesInternal = data.results;
					this.allPlaces[this.index]=this.placesInternal;
					if(!('next_page_token' in data))
					{
						this.allPlaces[this.index] = this.placesInternal;
					}
					this.nptInternal = data.next_page_token;

				} else {
					alert("Error");
				}
			});

		}
		else
		{
			this.placesInternal = this.allPlaces[this.index+1];
			this.index += 1;
		}
	}

	getMoreData() {

			let morePlacesUrl = "http://hw8-prachi-env.us-east-1.elasticbeanstalk.com/web-api/more-places";
			let headers = new Headers();
			let body = JSON.stringify({ page_token: this.nptInternal})
			headers.append('Content-Type', 'application/json');
			return this.http.post(morePlacesUrl, body, { headers: headers })
			.map(res => res.json());
	}

	addFavorite(place, i) {
		this.placesInternal[i].star = typeof this.placesInternal[i].star == 'undefined' ? true: !this.placesInternal[i].star;
		if (!this.favPlaceIdList.find(function(a) {return a.place_id == place.place_id;})){
			place.star = this.placesInternal[i].star;
			this.favPlaceIdList.push(place);
		}
		else{
			this.removeFavorite(place);

		}

		localStorage.setItem("favItems", JSON.stringify(this.favPlaceIdList));
		this.passFavList.emit(this.favPlaceIdList);

		
	}

	removeFavorite(place) {
		
		this.favPlaceIdList = this.favPlaceIdList.filter((value) => value.place_id != place.place_id);
		localStorage.setItem("favItems", JSON.stringify(this.favPlaceIdList));
		
		let temp: any = [];
		for(let p of this.placesInternal){
			
			if(p.place_id == place.place_id)
			{
				p.star = false;
			}
						
			temp.push(p);
		}

		this.placesInternal = temp;	
		this.passFavList.emit(this.favPlaceIdList);		

	}
	

	previousPlaces(){

		this.placesInternal = this.allPlaces[this.index -1];
		this.index = this.index -1;		

	}

	getPlaceDetails(place_id){
		this.disableDetailBtn = false;
		this.isVisible = true;
		localStorage.setItem("highlighted_item", place_id);
		this.placeIdDetailBtn = place_id;
		this.getDetailsData(place_id).subscribe(data => {
			
			if (data.status == "OK") {
				this.details = data.result;
				this.displayDetails = true;
				this.displayFav = false;
				this.displayResult = false;
				
			} else {
				alert("Error1");
			}
		});

		this.activePane = 'right';
	}

	list_clicked() {
		setTimeout(()=>{
			this.activePane = 'left';
		});
	}

	getDetailsData(place_id) {
		let detailsURL = "http://hw8-prachi-env.us-east-1.elasticbeanstalk.com/web-api/details";
		let headers = new Headers();
		let body = JSON.stringify({ place_id: place_id})	
		headers.append('Content-Type', 'application/json');
		return this.http.post(detailsURL, body, { headers: headers })
			.map(res => res.json());
	}

	list(e){
		if(localStorage.getItem("favItems"))
			this.favPlaceIdList = JSON.parse(localStorage.getItem("favItems"));
		this.placesInternal.forEach((val)=>{
			if(this.favPlaceIdList.find(function(a) {
				return a.place_id == val.place_id;
			})) {
				val.star = true;
			}
		});

		this.passFavList.emit(this.favPlaceIdList);
		this.highlighted_item = localStorage.getItem("highlighted_item");
		this.displayDetails = false;
		this.displayResult = true;
		this.triggerButton.emit("abc");
		if(this.index > 0){
			this.placesInternal = this.allPlaces[this.index];
		}
	}
}