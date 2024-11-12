import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-dialog-pause',
  templateUrl: './dialog-pause.component.html',
  styleUrls: ['./dialog-pause.component.scss']
})
export class DialogPauseComponent implements OnInit, OnDestroy {

  private pauseSubscription: Subscription = new Subscription();
  private timerSubscription: Subscription | null = null; // Para manter o controle do timer

  constructor(private dialogRef: MatDialogRef<DialogPauseComponent>) { }

  ngOnInit() {
    // // Se houver uma assinatura de timer ativa, cancelar para evitar múltiplas assinaturas
    // if (this.timerSubscription) {
    //   this.timerSubscription.unsubscribe();
    // }

    // // Verificar se é hora do café ou do almoço
    // const agora = new Date();
    // const hora = agora.getHours();

    // let duracaoTimer: number;

    // if (hora >= 8 && hora < 12) { // Café
    //   duracaoTimer = 60000; // 10 minutos em milissegundos
    // } else if (hora >= 12 && hora < 13) { // Almoço
    //   duracaoTimer = 3600000; // 60 minutos em milissegundos
    // } else if (hora >= 14 && hora < 17) { // Café
    //   duracaoTimer = 600000; // 10 minutos em milissegundos
    // } else {
    //   // Caso não seja hora do café nem do almoço, fechar imediatamente
    //   this.dialogRef.close();
    //   return; 
    // }

    // // Iniciar o timer apenas se não houver uma assinatura ativa
    // if (!this.timerSubscription) {
    //   this.timerSubscription = timer(duracaoTimer).subscribe(() => {
    //     this.dialogRef.close();
    //   });
    // }
  }

  ngOnDestroy() {
    // Limpar assinatura do timer quando o componente for destruído
    // if (this.timerSubscription) {
    //   this.timerSubscription.unsubscribe();
    // }
    // this.pauseSubscription.unsubscribe();
  }
}
