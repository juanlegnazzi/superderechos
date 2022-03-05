import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-derecho',
  templateUrl: './derecho.component.html',
  styleUrls: ['./derecho.component.scss']
})
export class DerechoComponent implements OnInit {
  derechos: string[];
  personajeId: number;
  fondoDerechoPhone: string;
  fondoDerechoTablet: string;
  containerDialog: HTMLElement | null;
  urlIzq = 'assets/botones/boton_izq.png';
  urlVolver = 'assets/botones/boton_volver.png';
  urlDer = 'assets/botones/boton_der.png';
  urlPlayAudio = 'assets/botones/boton_audio.png';
  urlMuteAudio = 'assets/botones/boton_audio_mute.png';
  // reproduciendoSpeech = false;
  // speechEscuchadoCompleto = false;
  // speech: SpeechSynthesis;
  // speechMensaje: SpeechSynthesisUtterance;
  audio: any;
  reproduciendoAudio = false;
  derechosAudio: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private dialogRef: MatDialogRef<DerechoComponent>,
  ) { 
    if (this.dataDialog?.derechos) {
      this.derechos = this.dataDialog.derechos;
      this.personajeId = this.dataDialog.personajeId;
      this.fondoDerechoPhone = this.dataDialog.fondoDerechoPhone;
      this.fondoDerechoTablet = this.dataDialog.fondoDerechoTablet;
      this.derechosAudio = this.dataDialog.derechosAudio;
    }
    // this.speech = window.speechSynthesis;
    // this.setSpeech();

    this.audio = new Audio(this.derechosAudio);
    this.audio.addEventListener("ended", () => {
      this.reproduciendoAudio = !this.reproduciendoAudio
    });
  }

  ngOnInit(): void {
    this.setFondo();
  }

  // generarTexto():void {
  //   var texto = '';
  //   var textoRespuestas = '';
    
  //   texto = 'Derechos: ';
  //   for (let i = 0; i < this.derechos.length; i++) {
  //     texto = texto + this.derechos[i] + ' ';
  //   }
    
  //   this.speechMensaje.text = texto;
  //   this.setAudio();
  // }

  closeDerecho(posicion: string) {
    let response = {
      data: {
        posicion: posicion,
      },
    };
    this.audio.pause();
    // this.speech.cancel();
    this.dialogRef.close(response);
  }

  setFondo(): void {
    this.containerDialog = document.getElementById('containerDialog');
    if(this.containerDialog) {
      if(screen.width === 600){
        this.containerDialog.style.backgroundImage = 'url('+this.fondoDerechoTablet+')';
      } else {
        this.containerDialog.style.backgroundImage = 'url('+this.fondoDerechoPhone+')';
      }
      this.containerDialog.style.backgroundSize = "100% 100%";
    }
  }

  // setAudio(): void {
  //   this.speechEscuchadoCompleto = true;
  //   if(this.reproduciendoSpeech) {
  //     this.speech.cancel();
  //     this.speechEscuchadoCompleto = false;
  //   } else {
  //       this.speech.speak(this.speechMensaje);
  //   }
  //   this.reproduciendoSpeech = !this.reproduciendoSpeech;
  // }

  // setSpeech(): void {
  //   this.speechMensaje = new SpeechSynthesisUtterance();
  //   this.speechMensaje.lang = 'es-ES';
  //   this.speechMensaje.addEventListener('end', () => {
  //     if(this.speechEscuchadoCompleto) {
  //       //solamente se debe cambiar el reproduciendoSpeech cuando se escucha por completo el speech, si se hace speech.cancel() no debe cambiarse
  //       this.reproduciendoSpeech = !this.reproduciendoSpeech;
  //       this.speechEscuchadoCompleto = false;
  //     }
  //   });
  // }

  setAudio(): void {
    if (this.reproduciendoAudio) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.reproduciendoAudio = !this.reproduciendoAudio
  }

}

