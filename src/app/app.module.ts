import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//components
import { FinComponent } from './fin/fin.component';
import { InicioComponent } from './inicio/inicio.component';
import { PersonajeComponent } from './personaje/personaje.component';
import { PreguntaComponent } from './pregunta/pregunta.component';


//material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DerechoComponent } from './derecho/derecho.component';

@NgModule({
  declarations: [
    AppComponent,
    FinComponent,
    InicioComponent,
    PersonajeComponent,
    PreguntaComponent,
    DerechoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    LazyLoadImageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
