class JuegoAdivinanza {
  constructor() {
    this.numeroAdivinar = 0;
    this.intentosRestantes = 5;
    this.intentosMaximos = 5;
    this.elementos = {
      mensaje: document.getElementById("mensaje"),
      intentos: document.getElementById("intentos"),
      input: document.getElementById("numeroUsuario"),
      progressBar: document.getElementById("progressBar"),
    };
    this.iniciarJuego();
    this.configurarEventos();
  }

  iniciarJuego() {
    this.numeroAdivinar = Math.floor(Math.random() * 100) + 1;
    this.intentosRestantes = this.intentosMaximos;
    this.actualizarInterfaz("¡Buena suerte! 🍀", "", "");
    this.actualizarIntentos();
    this.limpiarInput();
  }

  configurarEventos() {
    this.elementos.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.adivinarNumero();
      }
    });
  }

  adivinarNumero() {
    const numeroUsuario = parseInt(this.elementos.input.value);

    if (!this.validarEntrada(numeroUsuario)) {
      return;
    }

    if (numeroUsuario === this.numeroAdivinar) {
      this.manejarVictoria();
    } else if (this.intentosRestantes > 1) {
      this.manejarIntento(numeroUsuario);
    } else {
      this.manejarDerrota();
    }

    this.limpiarInput();
  }

  validarEntrada(numero) {
    if (isNaN(numero) || numero < 1 || numero > 100) {
      this.actualizarInterfaz(
        "Por favor, ingresa un número válido entre 1 y 100",
        "error",
        "Por favor, ingresa un número válido"
      );
      this.limpiarInput();
      return false;
    }
    return true;
  }

  manejarVictoria() {
    this.actualizarInterfaz(
      "🎉 ¡Felicidades! Has adivinado el número. ¡Eres increíble! 🌟",
      "success",
      "¡Felicidades! Has adivinado el número. Eres increíble"
    );
    this.crearEfectoVictoria();
  }

  manejarIntento(numeroUsuario) {
    this.intentosRestantes--;
    this.actualizarIntentos();

    const esMayor = numeroUsuario < this.numeroAdivinar;
    const mensaje = esMayor
      ? `📈 El número es más grande. Te quedan ${this.intentosRestantes} intentos`
      : `📉 El número es más pequeño. Te quedan ${this.intentosRestantes} intentos`;

    const mensajeVoz = esMayor
      ? `El número a adivinar es más grande, te quedan ${this.intentosRestantes} intentos`
      : `El número a adivinar es más pequeño, te quedan ${this.intentosRestantes} intentos`;

    // this.actualizarInterfaz(mensaje, "warning", mensajeVoz);
  }

  manejarDerrota() {
    this.intentosRestantes = 0;
    this.actualizarIntentos();
    this.actualizarInterfaz(
      `💔 ¡Se acabaron los intentos! El número era ${this.numeroAdivinar}`,
      "error",
      `Se acabaron los intentos, el número era ${this.numeroAdivinar}`
    );
  }

  actualizarInterfaz(mensaje, tipo, mensajeVoz) {
    this.elementos.mensaje.textContent = mensaje;
    this.elementos.mensaje.className = tipo;

    if (mensajeVoz) {
      this.decirMensaje(mensajeVoz);
    }
  }

  actualizarIntentos() {
    const porcentaje = (this.intentosRestantes / this.intentosMaximos) * 100;
    this.elementos.intentos.textContent = `Te quedan ${this.intentosRestantes} intentos`;
    this.elementos.progressBar.style.width = `${porcentaje}%`;
  }

  decirMensaje(texto) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-ES";
      utterance.volume = 0.8;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }

  limpiarInput() {
    this.elementos.input.value = "";
    this.elementos.input.focus();
  }

  crearEfectoVictoria() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.crearParticula();
      }, i * 100);
    }
  }

  crearParticula() {
    const particula = document.createElement("div");
    particula.className = "particle";
    particula.innerHTML = ["🎉", "⭐", "🌟", "✨", "🎊"][
      Math.floor(Math.random() * 5)
    ];
    particula.style.left = Math.random() * window.innerWidth + "px";
    particula.style.top = Math.random() * window.innerHeight + "px";
    particula.style.fontSize = Math.random() * 20 + 15 + "px";

    document.body.appendChild(particula);

    setTimeout(() => {
      particula.remove();
    }, 3000);
  }

  reiniciar() {
    this.iniciarJuego();
    this.elementos.mensaje.className = "";
  }
}

let juego;

window.addEventListener("DOMContentLoaded", () => {
  juego = new JuegoAdivinanza();
});

function adivinarNumero() {
  juego.adivinarNumero();
}

function reiniciar() {
  juego.reiniciar();
}
