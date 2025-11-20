let Valor_de_cambio_moneda;
/*-----------------------------------------------------------------------*/
// Función para obtener el valor de 1 USD en bolívares
async function obtenerCambioUSD() {
  try {
    const respuesta = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    const datos = await respuesta.json();

    Valor_de_cambio_moneda = datos.promedio;

  } catch (error) {
    console.error("Error al obtener el cambio:", error);
    return null;
  }
}

(async () => {
    // LLAMADA CLAVE: Se llama a la función una sola vez al inicio
    await obtenerCambioUSD();

    console.log(Valor_de_cambio_moneda)

})()






// Uso de la función


/*
function programarFuncionDiaria(funcionAEjecutar, horas) {
    const ahora = new Date();
    const hoy = ahora.getDate();
    const esteMes = ahora.getMonth();
    const esteAnio = ahora.getFullYear();
    const tiempoActualMs = ahora.getTime();

    // 1. Encontrar el próximo momento de ejecución
    let proximaEjecucionMs = Infinity;

    // Buscar la hora de hoy más cercana en el futuro
    for (const hora of horas) {
        // Creamos un objeto Date para la hora programada de hoy
        const tiempoProgramado = new Date(esteAnio, esteMes, hoy, hora, 0, 0, 0);
        const tiempoProgramadoMs = tiempoProgramado.getTime();

        if (tiempoProgramadoMs > tiempoActualMs) {
            // Es una hora en el futuro hoy
            proximaEjecucionMs = Math.min(proximaEjecucionMs, tiempoProgramadoMs);
        }
    }

    // 2. Si no hay más horas hoy, programar para la primera hora de mañana
    if (proximaEjecucionMs === Infinity) {
        // Ordenamos las horas para encontrar la primera hora de mañana
        horas.sort((a, b) => a - b);
        const primeraHoraManana = horas[0];
        const manana = new Date(esteAnio, esteMes, hoy + 1, primeraHoraManana, 0, 0, 0);
        proximaEjecucionMs = manana.getTime();
    }


    const retrasoMs = proximaEjecucionMs - tiempoActualMs;

    setTimeout(() => {

        funcionAEjecutar();

        programarFuncionDiaria(funcionAEjecutar, horas);

    }, retrasoMs);
}

const miFuncion = () => {

    obtenerCambioUSD().then(valor => {

      Valor_de_cambio_moneda=valor

    });
};

programarFuncionDiaria(miFuncion, [7, 15, 17]);*/