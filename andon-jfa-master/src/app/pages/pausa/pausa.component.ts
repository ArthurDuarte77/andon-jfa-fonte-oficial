import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodemcuService } from 'src/app/service/nodemcu.service';


@Component({
  selector: 'app-pausa',
  templateUrl: './pausa.component.html',
  styleUrls: ['./pausa.component.scss']
})
export class PausaComponent implements OnInit {

  constructor(private nodemcuService: NodemcuService, private _snackBar: MatSnackBar){}
  OnCafe: boolean = false;
  OnAlmoco: boolean = false;

  ngOnInit(): void {
  }
  cafe() {
    this.nodemcuService.postPausa();
    this.OnCafe = true;
    this.nodemcuService.pausa(true).subscribe();
    this.openSnackBar("Pausado com sucesso");

   // Registrar o Service Worker
   if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registro do Service Worker bem-sucedido
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // Falha no registro do Service Worker
        console.log('ServiceWorker registration failed: ', err);
        console.log(Cache)
      });
    });
    }

    setTimeout(() => {
      this.openSnackBar("Reiniciado com sucesso");
      this.nodemcuService.pausa(false).subscribe();
      this.OnCafe = false;
    }, 600000); // 10 minutos
  }

  // Lógica para pausa no almoço
  almoco() {
    // Chamar a função para pausar
    this.nodemcuService.postPausa();
    this.OnAlmoco = true;
    this.openSnackBar("Pausado com sucesso");
    this.nodemcuService.pausa(true).subscribe();

    // Registrar o Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          // Registro do Service Worker bem-sucedido
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // Falha no registro do Service Worker
          console.log('ServiceWorker registration failed: ', err);
          console.log(Cache)
        });
      });
    }

    setTimeout(() => {
      this.openSnackBar("Reiniciado com sucesso");
      this.nodemcuService.pausa(false).subscribe();
      this.OnAlmoco = false;
    }, 3600000); // 60 minutos
  }

  openSnackBar(text: string) {
    this._snackBar.open(text, 'OK', {
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }
}
