import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getData } from 'src/assets/estructura';
import { DerechoComponent } from '../derecho/derecho.component';
import { IPersonaje } from '../interfaces/IPersonaje';
import { PreguntaComponent } from '../pregunta/pregunta.component';

@Component({
  selector: 'app-personaje',
  templateUrl: './personaje.component.html',
  styleUrls: ['./personaje.component.scss']
})
export class PersonajeComponent implements OnInit {
  indexPersonaje: number = 0;
  model: IPersonaje | null = null;
  usuario: any;
  pregunta:any;
  contadorRespuestasUsuario = 0;
  audio: any;
  preguntaTitulo = '';
  defaultImage = "assets/Logo.png";
  mostrarBotones = true;
  personajeDiv: HTMLElement | null;
  urlDerechos = 'assets/botones/boton_centro.png';
  urlIzq = 'assets/botones/boton_izq.png';
  urlPlayAudio = 'assets/botones/boton_audio.png';
  urlMuteAudio = 'assets/botones/boton_audio_mute.png';
  urlDer = 'assets/botones/boton_der.png';
  reproduciendoAudio = false;

  animateCSS = (element:any, animation:any, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event:any) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { 
  }
  
  ngOnInit(): void {
    this.actualizarModel();
    this.usuario = {
      nombre: '',
      respuestas: [],
    }
  }

  actualizarModel(): void {
    this.model = getData[this.indexPersonaje];
    this.audio = new Audio(this.model?.audio);
    this.audio.addEventListener("ended", () => {
      this.reproduciendoAudio = !this.reproduciendoAudio
    });
    this.setFondo();
    this.botonesEstuart();
    this.elegirPregunta();
  }
  
  volverPersonaje(): void {
    this.mostrarBotones = false;
    this.reproduciendoAudio = false;
    this.animateCSS('.container', 'fadeOutRight').then((message) => {
      this.audio.pause();
      this.indexPersonaje--;
      this.actualizarModel();
      this.animateCSS('.container', 'fadeInLeft').then((message) => {
        this.mostrarBotones = true;
      });
    });
  }
    
  siguientePersonaje(): void {
    this.mostrarBotones = false;
    this.preguntaTitulo = 'Pregunta Numero ' + this.model?.id + ', '
    if (this.contadorRespuestasUsuario > this.indexPersonaje) {
      this.audio.pause();
      this.indexPersonaje++;
      this.avanzar();
    } else {
      this.abrirDialogPregunta();
    }
  }
    
  avanzar(): void {
    const element = document.querySelector('.container');
    if(element)
    element.classList.remove('animate__animated', 'animate__backInUp'); //elimino la animacion inicial
    this.reproduciendoAudio = false;
    this.animateCSS('.container', 'fadeOutLeft').then((message) => {
      this.audio.pause();
      if (this.indexPersonaje === getData.length) {
        sessionStorage.setItem('usuario',  JSON.stringify(this.usuario));
        this.router.navigate(['fin']);
      } else {
        this.actualizarModel();
        this.animateCSS('.container', 'fadeInRight').then((message) => {
          this.mostrarBotones = true;
        });
      }
    });
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
  
  elegirPregunta(): void {
  let longitudPreguntas = this.model?.quiz?.length;
    if (longitudPreguntas) {
      let indexPregunta = this.getRandomInt(longitudPreguntas);
      this.pregunta = this.model?.quiz[indexPregunta];
    }
  }

  abrirDialogPregunta(): void {
    this.audio.pause();
    this.reproduciendoAudio = false;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'custom-dialog-container';
    if(this.model) {
      dialogConfig.data = {
        pregunta: this.pregunta,
        preguntaTitulo: this.preguntaTitulo,
        fondoPreguntaPhone: this.model.imageQuestionPhone,
        fondoPreguntaTablet: this.model.imageQuestionTablet,
        personajeId: this.model.id,
      }
    };

    const dialogRef = this.dialog.open(PreguntaComponent, dialogConfig);
    //dialogRef.componentInstance.generarTextoPregunta();
    dialogRef.afterClosed().subscribe((response: any) => {
      if(response?.data.respuesta){
        this.usuario.respuestas.push(response.data.respuesta);
        this.contadorRespuestasUsuario ++;
        if(response.data.posicion === 'der'){
          this.siguientePersonaje();
        } else if (response.data.posicion === 'izq'){ 
          this.volverPersonaje();
        }
      }
      this.mostrarBotones = true;  
    });
  }

  abrirDialogDerechos(): void {
    this.audio.pause();
    this.reproduciendoAudio = false;
    
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'custom-dialog-container';
    if(this.model) {
      dialogConfig.data = {
        derechos: this.model.rights,
        personajeId: this.model.id,
        fondoDerechoPhone: this.model.imageRightsPhone,
        fondoDerechoTablet: this.model.imageRightsTablet,
        derechosAudio: this.model.audioRights,
      }
    };

    const dialogRef = this.dialog.open(DerechoComponent, dialogConfig);
    //dialogRef.componentInstance.generarTextoDerecho();
    dialogRef.afterClosed().subscribe((response: any) => {
      if(response.data.posicion === 'der'){
        this.siguientePersonaje();
      } else if(response.data.posicion === 'izq') {
        this.volverPersonaje();
      }
    });
  }

  setFondo(): void {
    this.personajeDiv = document.getElementById('personajeDiv');
    if(this.model && this.personajeDiv){
      if(screen.width === 600){
        this.personajeDiv.style.backgroundImage = 'url('+this.model?.imageTablet+')';
        document.body.style.backgroundImage = 'url('+this.model?.imageQuestionTablet+')';
      } else {
        this.personajeDiv.style.backgroundImage = 'url('+this.model?.imagePhone+')';
        document.body.style.backgroundImage = 'url('+this.model?.imageQuestionPhone+')';
      }
      document.body.style.backgroundSize = "cover";
      // document.body.style.backgroundRepeat = "no-repeat";
      // document.body.style.backgroundPosition = "center";
      this.personajeDiv.style.color = this.model.fontColor;
    }
  }

  botonesEstuart(): void {
    if(this.model && this.model.id === 4) {
      this.urlDerechos = "assets/botones/boton_centro_naranja.png";
      this.urlIzq = "assets/botones/boton_izq_naranja.png";
      this.urlPlayAudio = "assets/botones/boton_audio_naranja.png";
      this.urlMuteAudio = "assets/botones/boton_audio_naranja_mute.png";
      this.urlDer = "assets/botones/boton_der_naranja.png";
    } else {
    this.urlDerechos = 'assets/botones/boton_centro.png';
    this.urlIzq = 'assets/botones/boton_izq.png';
    this.urlPlayAudio = 'assets/botones/boton_audio.png';
    this.urlMuteAudio = 'assets/botones/boton_audio_mute.png';
    this.urlDer = 'assets/botones/boton_der.png';
    }
  }

  setAudio(): void {
    if (this.reproduciendoAudio) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.reproduciendoAudio = !this.reproduciendoAudio
  }

}

