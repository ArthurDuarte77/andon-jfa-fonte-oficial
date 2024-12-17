import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private http: HttpClient ) {}


  enviarMensagem(op: string, status: string) {
    this.http.get(`http://172.16.34.147:8070/changeColor/fonte?op=${op}&&status=${status}`).subscribe()
  }
}
