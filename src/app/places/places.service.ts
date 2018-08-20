import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PlacesService {

  constructor(private http: Http) { }

  public getAllPlaces(inputs) {

  	let url = "/places";
  	let headers = new Headers();
  	let body = JSON.stringify({keyword: inputs.keyword, category: inputs.category, distance: inputs.distance})
  	headers.append('Content-Type', 'application/json');
    return this.http.post('/places', body, {headers: headers})
    .map(res => res.json());
  }
}