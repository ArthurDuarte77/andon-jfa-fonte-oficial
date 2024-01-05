import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modelo } from '../module/modelo';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Modelo[]>{
    return this.http.get<Modelo[]>("http://172.16.34.147:8090/api/v1/fonte")
  }

  changeIsCurrent(modelo: string, isCurrent: boolean): void{
   this.http.get("http://172.16.34.147:8090/api/v1/fonte/" + modelo + "/" + isCurrent).subscribe()
  }

}
