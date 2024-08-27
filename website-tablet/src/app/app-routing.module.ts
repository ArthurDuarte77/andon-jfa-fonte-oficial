import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './pages/counter/counter.component';
import { AppComponent } from './app.component';
import { AnaliseComponent } from './pages/analise/analise.component';

const routes: Routes = [
  { path: 'counter/:name', component: CounterComponent },
  { path: 'lider', component: AnaliseComponent },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}