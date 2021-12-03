import { City } from './../common/city';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { District } from '../common/district';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private citiesUrl = "http://localhost:9999/api/cities";
  private districtsUrl = "http://localhost:9999/api/districts";

  constructor(private httpClient: HttpClient) { }

  getCities():Observable<City[]>{
    return this.httpClient.get<ResponseCities>(this.citiesUrl).pipe(
      map(response => response._embedded.cities)
    );
  }

  getDistricts(theCitiCode: number):Observable<District[]>{
    // search url

    const searchDistrictUrl = `${this.districtsUrl}/search/findByCityCode?code=${theCitiCode}`;
    return this.httpClient.get<ResponseDistrict>(searchDistrictUrl).pipe(
      map(response => response._embedded.districts)
    );
  }

}

interface ResponseCities{
  _embedded:{
    cities: City[];

  }
}

interface ResponseDistrict{
  _embedded:{
    districts : District[];

  }
}
