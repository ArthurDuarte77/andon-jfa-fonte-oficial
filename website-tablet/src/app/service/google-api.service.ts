import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor(private http: HttpClient) { }

  getTitle(videoId: string): Observable<any>{
    return this.http.get<any>(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyANnwEmtKtM_Gjlis2uG-rgRIVlkHg6-7c`)
  }

}
