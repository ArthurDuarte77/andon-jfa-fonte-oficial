import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-cca',
  templateUrl: './dialog-cca.component.html',
  styleUrls: ['./dialog-cca.component.scss']
})
export class DialogCcaComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DialogCcaComponent>);

  constructor() { }

  ngOnInit(): void {
  }

}
