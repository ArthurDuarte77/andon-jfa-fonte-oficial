import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleApiService } from 'src/app/service/google-api.service';
import { OperationService } from 'src/app/service/operation.service';

@Component({
  selector: 'app-dialog-help',
  templateUrl: './dialog-help.component.html',
  styleUrls: ['./dialog-help.component.scss']
})
export class DialogHelpComponent implements OnInit {

  pdfUrl: any = "";
  videoUrl: any = "";
  videoSecondUrl: any = "";
  title: String[] = [];

  constructor(
    public dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private sanitizer: DomSanitizer, private operationService: OperationService,
    private googleApiService: GoogleApiService
  ) { }


  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    for (let i = 0; i < this.data.length; i++) {
      const match = this.data[i].match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|y\/)([^"&?\/\s]{11})/);

      this.googleApiService.getTitle(match[1]).subscribe(res => {
        console.log(res)
        this.title[i] = res.items[0].snippet.title
      })
      this.data[i] = this.sanitizer.bypassSecurityTrustResourceUrl(this.data[i])
    }
  }

}
