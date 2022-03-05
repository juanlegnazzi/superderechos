import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.scss']
})
export class PreguntaComponent implements OnInit {
  pregunta: any = null;
  respuestas: any[] = [];
  preguntaTitulo: string;
  audio: any;
  respuestaCorrecta: string;
  usuarioRespuesta: any;
  fondoPreguntaPhone: string;
  fondoPreguntaTablet: string;
  containerDialog: HTMLElement | null;
  personajeId: number;
  // usuario: IUsuario | null = null;
  urlIzq = 'assets/botones/boton_izq.png';
  urlPlayAudio = 'assets/botones/boton_audio.png';
  urlMuteAudio = 'assets/botones/boton_audio_mute.png';
  urlDer = 'assets/botones/boton_der.png';
  reproduciendoSpeech = false;
  speechEscuchadoCompleto = false;
  speech: SpeechSynthesis;
  speechMensaje: SpeechSynthesisUtterance;
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
  audioCorrect: any;
  audioIncorrect: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private dialogRef: MatDialogRef<PreguntaComponent>,
  ) { 
    if (this.dataDialog?.pregunta && this.dataDialog?.fondoPreguntaPhone && this.dataDialog?.fondoPreguntaTablet ) {
      this.pregunta = this.dataDialog.pregunta.question;
      this.respuestas = this.dataDialog.pregunta.answers;
      this.preguntaTitulo = this.dataDialog.preguntaTitulo;
      //  this.audio = new Audio(this.dataDialog.pregunta.audio);
      this.respuestaCorrecta = 'La respuesta correcta era: ' + this.respuestas.filter(respuesta => respuesta.correct)[0].description;
      this.fondoPreguntaPhone = this.dataDialog.fondoPreguntaPhone;
      this.fondoPreguntaTablet = this.dataDialog.fondoPreguntaTablet;
      this.personajeId = this.dataDialog.personajeId;
    }
   this.speech = window.speechSynthesis;
   this.setSpeech();
   this.audioCorrect = new Audio('assets/pregunta/correct.mp3');
   this.audioCorrect.volume = 0.5;
   this.audioIncorrect = new Audio('assets/pregunta/incorrect.mp3');
   this.audioIncorrect.volume = 0.5;

  }

  ngOnInit(): void {
    this.setFondo();
    this.generarTextoPregunta();
  }

  respuestaUsuario(respuesta:any, indiceRespuestaUsuario: number) {
    if (!this.usuarioRespuesta) {
      this.speech.cancel();
      const botones = document.querySelectorAll<HTMLElement>('.boton-respuesta');
      const indiceCorrecta = this.respuestas.indexOf(this.respuestas.filter(respuesta => respuesta.correct)[0]);
      botones[indiceRespuestaUsuario].classList.add('animate__animated', 'animate__headShake');
      botones[indiceRespuestaUsuario].addEventListener('animationend', () => {
        this.usuarioRespuesta = respuesta;
        for(var i = 0; i < botones.length; i++) {
          botones[i].style.color = 'white';
          if (i === indiceCorrecta) {
            botones[i].style.background = '#1BB379';
          }
          else {
            botones[i].style.background = '#DB1835'
          };
        }
        var titulo = document.getElementById('idPregunta');
        if (respuesta.correct) {
          if (titulo) {
            titulo.classList.add('animate__animated', 'animate__tada');
            this.pregunta = '¡Respuesta Correcta!'
            this.audioCorrect.play();
          }
        } else {
          if (titulo) {
            titulo.classList.add('animate__animated', 'animate__swing');
            this.pregunta = '¡Respuesta Incorrecta!'
            this.audioIncorrect.play();
          }
        }
        this.generarTextoRespuesta();
      });    
    }
  }

  closePregunta(posicion: string) {
    let response = {
      data: {
        respuesta: this.usuarioRespuesta,
        posicion: posicion,
      },
    };
    // this.audio.pause();
    this.speech.cancel();
    this.dialogRef.close(response);
    this.usuarioRespuesta = '';
  }


  colores(indice: number):string{
    let color = "";
    switch(indice){
      case 0: color="blue";
      break;
       
      case 1: color="purple";
      break;
       
      default: color="orange";
      break;
       
    }
    return color;
  }

  generarTextoPregunta(): void {
    var texto = '';
    var textoRespuestasPosibles = '';
    this.respuestas.forEach(generarTextoRespuestasPosibles);
    function generarTextoRespuestasPosibles(respuesta:any, index:number) {
      textoRespuestasPosibles += 'Respuesta Numero ' + (index + 1) + ', ' + respuesta.description + ', ';    
    }
    texto = this.preguntaTitulo + this.pregunta + ' ' + textoRespuestasPosibles;
    this.speechMensaje.text = texto;
  }

  generarTextoRespuesta(): void {
    var texto = '';
    if(this.usuarioRespuesta.correct) {
      texto = "Respuesta correcta! ";
    } else {
      texto = "Respuesta incorrecta! ";
    }
    texto += this.respuestaCorrecta;
    this.speechMensaje.text = texto;
  }

  setFondo(): void {
    this.containerDialog = document.getElementById('containerDialog');
    if(this.containerDialog) {
      if(screen.width === 600){
        this.containerDialog.style.backgroundImage = 'url('+this.fondoPreguntaPhone+')';
      } else {
        this.containerDialog.style.backgroundImage = 'url('+this.fondoPreguntaTablet+')';
      }
      this.containerDialog.style.backgroundSize = "100% 100%";
    }
  }

  setAudio(): void {
    this.speechEscuchadoCompleto = true;
    if(this.reproduciendoSpeech) {
      this.speech.cancel();
      this.speechEscuchadoCompleto = false;
    } else {
        this.speech.speak(this.speechMensaje);
    }
    this.reproduciendoSpeech = !this.reproduciendoSpeech;
  }

  setSpeech(): void {
    this.speechMensaje = new SpeechSynthesisUtterance();
    this.speechMensaje.lang = 'es-ES';
    this.speechMensaje.addEventListener('end', () => {
      if(this.speechEscuchadoCompleto) {
        //solamente se debe cambiar el reproduciendoSpeech cuando se escucha por completo el speech, si se hace speech.cancel() no debe cambiarse
        this.reproduciendoSpeech = !this.reproduciendoSpeech;
        this.speechEscuchadoCompleto = false;
      }
    });
  }
  
}