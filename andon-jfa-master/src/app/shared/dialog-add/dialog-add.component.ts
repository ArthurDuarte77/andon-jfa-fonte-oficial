import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss']
})
export class DialogAddComponent implements OnInit{

  data = inject(MAT_DIALOG_DATA);
  
  constructor() {
  }

  ngOnInit(): void {
    this.initializeFormData();
  }

  formData:any = {};


  initializeFormData(): void {
    this.data.columns.forEach((column: any) => {
      this.formData[column] = '0'; 
    });

  }



  
}
