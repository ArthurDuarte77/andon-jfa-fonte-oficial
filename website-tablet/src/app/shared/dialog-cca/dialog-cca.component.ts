import { OperationService } from './../../service/operation.service';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-cca',
  templateUrl: './dialog-cca.component.html',
  styleUrls: ['./dialog-cca.component.scss']
})
export class DialogCcaComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DialogCcaComponent>);

  constructor(private OperationService: OperationService, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  cca(id: number, min: string, max: string, min2: string, max2: string){
    if(id && min && max){
      this.OperationService.updateCca(id, parseFloat(min), parseFloat(max)).subscribe(res => {
        this.openSnackBar('CCA Atualizado com Sucesso', 'Ok');
        this.dialogRef.close()
      })
    }
    if(min2 && max2){
      this.OperationService.updateCca(2,  parseFloat(min2), parseFloat(max2)).subscribe(res => {
        console.log(res)
        this.openSnackBar('CCA Atualizado com Sucesso', 'Ok');
        this.dialogRef.close()
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
