import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://172.16.34.147:8080/ws',
      onConnect: () => {
        console.log('Conectado ao WebSocket');
        // this.conectar().subscribe(res => {
        //   console.log(res)
        // })
      },
    });

    this.client.activate();
  }

  conectar(): Observable<Message> {
    return new Observable<Message>(observer => {
      const subscription = this.client.subscribe('/topic/news', message => {
        observer.next(message);
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  enviarMensagem(op: string, status: string) {
    const topico = '/app/news';
    this.client.publish({
      destination: topico,
      body: JSON.stringify({ status, op })
    });
  }
}
