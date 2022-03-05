import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})

export class InicioComponent implements OnInit {
  titulo = 'Super Derechos';
  nombre = '';
  parseIntNombre: boolean = false;
  audio: any;
  image="assets/Logo.png";
  inicioDiv: HTMLElement | null;

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

  constructor (
    private router: Router,
  ) {
    document.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        this.guardarNombreSessionStorage();
      }
    });
  }

  ngOnInit(): void {
    this.setFondo();
}

  guardarNombreSessionStorage(): void {
    if(this.nombre !== '' && this.parseIntNombre) {
      sessionStorage.setItem('nombre', this.nombre);
      this.animateCSS('.container', 'backOutDown').then((message) => {
      this.router.navigate(['personaje']);
      });
    }
  }

  comprobarString(): void {
    this.parseIntNombre = isNaN(parseInt(this.nombre));
  }

  setFondo(): void {
    if(screen.width === 600){
      document.body.style.backgroundImage = 'url("assets/inicio/fondo_limpio_1024x600.png")';
    } else {
      document.body.style.backgroundImage = 'url("assets/inicio/fondo_limpio_1920x1080.png")';
    }
    document.body.style.backgroundSize = "100% 100%";
  }

}
