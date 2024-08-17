import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdressService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  searchCountryByName(country: string, page=1,size=10): any {
    return this.http.get(`${this.API_URL}/addresses?country=${country}&page=${page}&limit=${size}`);
  }

  searchUniveristyByName(arg0: string): any {
    console.log(arg0);
  }
  searchCityByName(country: string, city:string, page=1,size=10): any {
    return this.http.get(`${this.API_URL}/addresses?country=${country}&city=${city}&page=${page}&limit=${size}`);
  }

}
