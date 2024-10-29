import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-name',
  templateUrl: './dialog-name.component.html',
  styleUrls: ['./dialog-name.component.scss'],
})
export class DialogNameComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>) {}

  @ViewChild('message', { static: false }) inputFocus!: ElementRef<HTMLInputElement>;

  intervalo: any;

  ngOnInit(): void {
    this.intervalo = setInterval(() => {
      this.inputFocus.nativeElement.focus();
    }, 100);
  }

  closeDialog(name: string){
    clearInterval(this.intervalo)
    localStorage.removeItem("name")
    localStorage.setItem("name", name)
    this.dialogRef.close();
  }
}
