import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlacesService {

  constructor(private http: Http) { }

  public getAllPlaces(inputs) {

  	let url = "http://www.localhost:8080/places";
  	let headers = new Headers();
  	let body = JSON.stringify({keyword: inputs.keyword, category: inputs.category, distance: inputs.distance})
  	headers.append('Content-Type', 'application/json');
    return this.http.post(url, body, {headers: headers})
    .map(res => res.json());	

  }
}