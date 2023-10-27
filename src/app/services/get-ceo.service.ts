import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetCEOService {

  constructor(private http: HttpClient) { }

  getInfo(){
    const url = environment.ceo
    return this.http.get(url)
  }
}
