
/**AudioSpeak.js desarrollado por luis e Duno Castellano*/

function DetectedMouse(idDom){

  document.getElementById(idDom).addEventListener('mouseover',(event)=>{

    console.log(document.getElementById(idDom).innerHTML)

              Speak(document.getElementById(idDom).innerHTML);
  })
}




function Speak(text) {
  // Verificamos si el navegador soporta el API de Speech Synthesis
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;

    // Opcional: puedes configurar la voz, el tono, la velocidad, etc.
    // speech.voice = getVoice('es-MX'); // Ejemplo: elegir una voz específica
    speech.volume = 1;
    speech.pitch = 1; // Tono (de 0 a 2)
    speech.rate = 1; // Velocidad (de 0.1 a 10)

    // Hablamos el texto
    window.speechSynthesis.speak(speech);
  } else {
    // Si el navegador no lo soporta, mostramos un mensaje
    console.error("El API de Speech Synthesis no es soportado por este navegador.");
  //  alert("Lo sentimos, tu navegador no puede reproducir audio a partir de texto.");
  }
}

// Ejemplo de uso:
// SpeakAudio("Hola, soy un asistente de voz.");
