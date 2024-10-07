import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogMetaComponent } from './shared/dialog-meta/dialog-meta.component';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DECIMAL_FORMAT_DEFAULT } from 'src/decimal-format.provider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { PausaComponent } from './pages/pausa/pausa.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogPauseComponent } from './shared/dialog-pause/dialog-pause.component';
import { DialogControleRealizadoComponent } from './shared/dialog-controle-realizado/dialog-controle-realizado.component';
import { ControleGeralComponent } from './pages/controle-geral/controle-geral.component';
import { PainelComponent } from './pages/painel/painel.component';
import { ConfiguracaoComponent } from './pages/configuracao/configuracao.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { DialogAddComponent } from './shared/dialog-add/dialog-add.component';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePt, 'pt');
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import {JsonPipe} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { RelatorioHistoricoComponent } from './pages/relatorio-historico/relatorio-historico.component';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { VideoRelatorioComponent } from './pages/video-relatorio/video-relatorio.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogMetaComponent,
    HomeComponent,
    PausaComponent,
    DialogPauseComponent,
    DialogControleRealizadoComponent,
    ControleGeralComponent,
    PainelComponent,
    ConfiguracaoComponent,
    DialogAddComponent,
    RelatorioHistoricoComponent,
    VideoRelatorioComponent
  ],
  imports: [
    MatTooltipModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    JsonPipe,
    MatChipsModule
  ],
  providers: [DECIMAL_FORMAT_DEFAULT,{ provide: LOCALE_ID, useValue: 'pt' },     { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
