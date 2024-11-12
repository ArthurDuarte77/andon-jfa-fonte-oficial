import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modelo } from '../module/modelo';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Modelo[]>{
    return this.http.get<Modelo[]>( environment.url + "fonte")
  }

  changeIsCurrent(modelo: string, isCurrent: boolean): void{
   this.http.get( environment.url + "fonte/" + modelo + "/" + isCurrent).subscribe()
  }

}
