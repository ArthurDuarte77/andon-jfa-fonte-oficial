import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-aviso',
  templateUrl: './dialog-aviso.component.html',
  styleUrls: ['./dialog-aviso.component.scss']
})
export class DialogAvisoComponent implements OnInit {

constructor(public dialogRef: MatDialogRef<DialogAvisoComponent>) {}

  ngOnInit(): void {
  }

}
