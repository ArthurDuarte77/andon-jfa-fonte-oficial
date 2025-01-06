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

  cca(min: string, max: string){
    this.OperationService.updateCca(parseFloat(min), parseFloat(max)).subscribe(res => {
      console.log(res)
      this.openSnackBar('CCA Atualizado com Sucesso', 'Ok');
      this.dialogRef.close()
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
