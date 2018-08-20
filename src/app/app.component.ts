import { Component, ViewChild, AfterViewInit, OnInit, ElementRef, EventEmitter, Output} from '@angular/core';
import { PlacesService } from './places.service';
import { PlacesComponent } from './places/places.component';
import { Http, Headers } from '@angular/http';
import {} from '@types/googlemaps';

declare var google:any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	
	@ViewChild("loctext") locelem : ElementRef;
	@ViewChild("formid") form : ElementRef;

	private inputs: any = {};
	private isLoading = false;
	private placesList: any = [];
	private lat: number = null;
	private lon: number = null;
	private setDisable = true;
	private curLocRadio = true;
	private disabledSearch = false;
	private curLocationResult: any = {};
	private location:boolean = true;
	private nextPageToken: any;
	private displayFav: boolean = false;
	private displayResult: boolean = true;
	private favoritePlaces: any = [];
	private mapJsonObject: any = {};
	private noPlaces: boolean = false;
	private checkRadio: string = "auto";
	private noFav: boolean = false;
	private dataFetched: boolean = true;
	private favPlaceIdList: any = [];
	private favPlacesLength: number = null;
	private favBtn: boolean = false;

	constructor(private http: Http) {

	localStorage.removeItem('highlighted_item');
	}

	ngOnInit() {
		
		this.curLocRadio = true;
		this.inputs.category = "default";		
		let curLocationUrl = "http://ip-api.com/json/";
		this.http.get(curLocationUrl).subscribe(
			(result) =>{
			this.curLocationResult = result.json();
			this.lat = this.curLocationResult["lat"];
			this.lon = this.curLocationResult["lon"];
			}       
    	);

    	let autocomplete = new google.maps.places.Autocomplete(this.locelem.nativeElement, {
    		types: ['address']
    	});
    	
	}

	doSomething(favPlaces){
		this.favPlacesLength = favPlaces.length;
		if(favPlaces.length <= 0)
		{
			this.noFav =true;
			this.displayFav = false;
		}
		else{
			this.noFav =false;
		}
	}

	trig(e){
		this.searchPlace();
	}

	disableInputBox(){
		this.setDisable = true;
	}

	enableInputBox(){
		this.setDisable = false;
	}


	correctKeyword()
	{
		if(!this.inputs.keyword)
		{
			return false;
		}
		else
		{
			if (!this.inputs.keyword.replace(/\s/g, '').length) {
   					return false;
			}

			else
			{
			return true;
			}
		}
	}


	correctLocation()
	{
		if(!this.setDisable && this.inputs.locationText)
		{
			if (!this.inputs.locationText.replace(/\s/g, '').length) {
   					return false;
			}

			else
			{
			return true;
			}
		}

		if(this.setDisable)
		{
			return true;
		}

		if(!this.setDisable && !this.inputs.locationText)
		{
			return false;
		}
	}


	searchable()
	{
		if (this.correctLocation() && this.correctKeyword())
		{
			return true;
		}

		else
		{
			return false;
		}
	} 


	clear() {
		
		localStorage.removeItem('highlighted_item');
		this.isLoading = false;
		this.setDisable = true;
		this.curLocRadio = true;
		this.noPlaces = false;
		this.checkRadio = "auto";
		this.form.nativeElement.reset();
		this.inputs = {};
		this.inputs.category = "default";
		this.favBtn = false;
	}

	searchPlace() {

		this.dataFetched = false;
		this.displayFav = false;
		this.displayResult = true;
		this.favBtn = false;

		if(!this.setDisable)
		{
			this.inputs.locationText = this.locelem.nativeElement.value;
		}
		
		this.getData().subscribe(data => {
			this.dataFetched = true;
			if (data.status == "OK") {
				this.isLoading = true;
				this.noPlaces = false;
				this.placesList = data.results;
				
				this.nextPageToken = data.next_page_token;
				let favItemIdList = JSON.parse(localStorage.getItem("favItems"));
				let temp: any = [];
				if(favItemIdList!=null && favItemIdList.length != 0){
					for(let place of this.placesList){
						let isStar: boolean = false;
						for(let id of favItemIdList){
							if(id == place.place_id)
							{
								isStar = true;
								break;
							}
						}

						place.star = isStar;
						temp.push(place);
					}

					this.placesList = temp;

				}

			} else if(data.status == "ZERO_RESULTS"){
				this.noPlaces = true;
				
      			}

		});

		this.mapJsonObject = {
							"lat": this.lat,
							"lon": this.lon,
							"fromText": this.inputs.locationText
		}
	}

	getData() {
		let dis = 1;
		let apiEndURL = "http://hw8-prachi-env.us-east-1.elasticbeanstalk.com/web-api/place";
		let headers = new Headers();
		if(!this.inputs.distance){
			dis = 10;
		}

		else
		{
			dis = this.inputs.distance;
		}
		

		let body = JSON.stringify({ keyword: this.inputs.keyword, category: this.inputs.category, distance: 
		dis*1609, locationText: this.inputs.locationText, lat: this.lat, lon: this.lon })	
		headers.append('Content-Type', 'application/json');
		return this.http.post(apiEndURL, body, { headers: headers })
			.map(res => res.json());
	}

	displayFavoriteList()
	{	
		this.favBtn = true;
		if(this.favPlacesLength <= 0){
			this.noFav = true;
			this.displayFav = false;
		}
		else{
			this.noFav = false;
			this.displayFav = true;
		}
		
		this.displayResult = false;

	}

	
}