import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nodemcu } from '../module/nodemcu';
import { Observable } from 'rxjs';
import { Realizado } from '../module/realizado';
import { ResultadoGeral } from '../module/resultadoGeral';
import { environment } from 'src/environments/environment.development';
import { Pausa } from '../module/pausa';
import { Operation } from '../module/operation';
import { RealizadoHoraria } from '../module/realizadoHoraria';

@Injectable({
  providedIn: 'root',
})
export class NodemcuService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {

    return this.http.get<Nodemcu>(
       environment.url + 'nodemcu',
    );
  }

  getAllRealizado(): Observable<Realizado[]>{
    return this.http.get<Realizado[]>( environment.url + "realizadoHoraria")
  }

  postResultsGeral(imposto: number, realizado: number){
    this.http.post( environment.url + "geral", {'imposto': imposto, 'realizado': realizado}).subscribe()
  }

  getAllResultadoGeral(): Observable<ResultadoGeral[]>{
    return this.http.get<ResultadoGeral[]>( environment.url + "geral")
  }

  pausa(pausa: boolean){
    return this.http.get(environment.url + "operation/pausa/" + pausa)
  }

  postPausa(){
    this.http.post(environment.url+ "pausa", {}).subscribe()
  }
  
  getPausa(): Observable<Pausa[]>{
    return this.http.get<Pausa[]>(environment.url+ "pausa")
  }

  getAllOperation(): Observable<Operation[]>{
    return this.http.get<Operation[]>(environment.url + 'operation')
  }

  postNodemcu(body: Nodemcu): Observable<Nodemcu>{
    return this.http.post<Nodemcu>(environment.url + 'nodemcu', body)
  }

  postRealizado(body: RealizadoHoraria): Observable<RealizadoHoraria>{
    return this.http.post<RealizadoHoraria>(environment.url + 'realizadoHoraria', body)
  }
}
