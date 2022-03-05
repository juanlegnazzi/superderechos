import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fin',
  templateUrl: './fin.component.html',
  styleUrls: ['./fin.component.scss']
})
export class FinComponent implements OnInit {
  nombre = sessionStorage.getItem('nombre');
  usuario: any;
  correctas: number = 0;
  puntaje = 0;
  totalPreguntas = 0;
  titulo = '';
  tituloPuntaje = '';
  textoPuntaje = '';
  textoCantPreguntas = '';
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
  urlPlayAudio = 'assets/botones/boton_audio.png';
  urlMuteAudio = 'assets/botones/boton_audio_mute.png';
  urlVolver = 'assets/botones/boton_volver_jugar.png';
  reproduciendoSpeech = false;
  speechEscuchadoCompleto = false;
  speech: SpeechSynthesis;
  speechMensaje: SpeechSynthesisUtterance;
  audio: any;


  constructor(
    private router: Router,
  ) { 
    this.speech = window.speechSynthesis;
    this.audio = new Audio('assets/fin/fin.mp3');
    this.audio.volume = 0.5;
    setTimeout(() => {
      this.audio.play();
    }, 1250)
  }

  ngOnInit(): void {
    const userWithoutParse = sessionStorage.getItem('usuario');
    if (userWithoutParse){
      this.usuario = JSON.parse(userWithoutParse); 
      this.totalPreguntas = this.usuario.respuestas.length;
      this.calcularCorrectas();
      this.puntaje = Math.floor((this.correctas / this.totalPreguntas) * 100);  
    }
    this.titulo = '¡FELICITACIONES ' + this.nombre?.toUpperCase() + '!';
    this.tituloPuntaje = 'Has obtenido ';
    this.textoPuntaje = this.puntaje + ' PUNTOS';
    if (this.correctas === 1) {
    this.textoCantPreguntas = '¡Muy bien! Has respondido ' + this.correctas + ' pregunta correcta.';
    } else {
      this.textoCantPreguntas = '¡Muy bien! Has respondido ' + this.correctas + ' preguntas correctas.';
    }
    this.setSpeech();
    //this.leerTexto();

    this.setFondo();
  }
  
  calcularCorrectas(): void {
    if (this.usuario) {
      for(let i = 0; i < this.totalPreguntas; i++){
        if(this.usuario.respuestas[i].correct){
          this.correctas++;
        }
      }
    }
  }
  
  volverInicio(): void {
    this.speech.cancel();
    this.audio.pause();
    const element = document.querySelector('.flex-container');
    if(element)
      element.classList.remove('animate__animated', 'animate__fadeInRight');
    this.animateCSS('.flex-container', 'backOutUp').then((message) => {
      this.router.navigate(['']);
    });
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
    this.speechMensaje.text = this.titulo + this.tituloPuntaje + this.textoPuntaje + ", " + this.textoCantPreguntas + ", Si deseas puedes volver a jugar";
    this.speechMensaje.lang = 'es-ES';
    this.speechMensaje.addEventListener('end', () => {
      if(this.speechEscuchadoCompleto) {
        //solamente se debe cambiar el reproduciendoSpeech cuando se escucha por completo el speech, si se hace speech.cancel() no debe cambiarse
        this.reproduciendoSpeech = !this.reproduciendoSpeech;
        this.speechEscuchadoCompleto = false;
      }
    });
  }

  setFondo(): void {
    if(screen.width === 600){
      document.body.style.backgroundImage = 'url("assets/fin/fondo_1024x600.png")';
    } else {
      document.body.style.backgroundImage = 'url("assets/fin/fondo_1920x1080.png")';
    }
    document.body.style.backgroundSize = "100% 100%";
  }
}