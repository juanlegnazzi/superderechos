import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinComponent } from './fin/fin.component';
import { InicioComponent } from './inicio/inicio.component';
import { PersonajeComponent } from './personaje/personaje.component';

const routes: Routes = [
  { path: 'personaje', component: PersonajeComponent },
  { path: 'fin', component: FinComponent },
  { path: '', component: InicioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


