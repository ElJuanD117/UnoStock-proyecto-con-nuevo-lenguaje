/*--------------------------------------------------------*/

function obtenerFechaHora(formato) {
  const fecha = new Date();

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  
  let horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const segundos = String(fecha.getSeconds()).padStart(2, '0');
  
  // Lógica para el formato de 12 horas (AM/PM)
  const ampm = horas >= 12 ? 'pm' : 'am';
  horas = horas % 12;
  horas = horas ? horas : 12; // La hora '0' debe ser '12'
  const horas12 = String(horas).padStart(2, '0');

  const fechaCompleta = `${anio}-${mes}-${dia}`;
  const fechaCorto = `${dia}/${mes}/${anio}`;
  const horaCompleta = `${String(fecha.getHours()).padStart(2, '0')}:${minutos}:${segundos}`;
  const horaCorta = `${String(fecha.getHours()).padStart(2, '0')}:${minutos}`;
  const hora12Completa = `${horas12}:${minutos}:${segundos} ${ampm}`;
  const hora12Corta = `${horas12}:${minutos}${ampm}`;

  switch (formato) {
    case 'YYYY-MM-DD':
      return fechaCompleta;
    case 'DD/MM/YYYY':
      return fechaCorto;
    case 'HH:mm:ss':
      return horaCompleta;
    case 'HH:mm':
      return horaCorta;
    case 'YYYY-MM-DD HH:mm:ss':
      return `${fechaCompleta} ${horaCompleta}`;    
    case 'YYYY-MM-DDTHH:mm': // Nuevo formato
      return `${fechaCompleta}T${String(fecha.getHours()).padStart(2, '0')}:${minutos}`;
    case 'YYYY-MM-DDTHH:mm:ss': // Nuevo formato
      return `${fechaCompleta}T${String(fecha.getHours()).padStart(2, '0')}:${minutos}:${segundos}`;
    case 'DD/MM/YYYY HH:mm:ss':
      return `${fechaCorto} ${horaCompleta}`;
    case 'DD/MM/YYYY HH:mm':
      return `${fechaCorto} ${horaCorta}`;
    case 'DD div YYYY HH:mm ampm':
      return `${dia} div ${anio} ${hora12Corta}`;
    default:
      return fecha;
  }
}

/*--------------------------------------------------------*/

function convertirAFormato(valorFormateado, tipoInput) {
  let fecha;
  let hora;

  // Extraer fecha y hora del valor formateado
  if (valorFormateado.includes('T')) {
        [fecha, hora] = valorFormateado.split('T');
  } else if (valorFormateado.includes(' ')) {
       [fecha, hora] = valorFormateado.split(' ');
  } else {
      fecha = valorFormateado;
      hora = '00:00:00'; // Por si solo viene la fecha
  }

  // Crear objeto Date
  let fechaCompleta;
  if (fecha.includes('/')) {
    const [dia, mes, anio] = fecha.split('/');
    fechaCompleta = new Date(`${anio}-${mes}-${dia}T${hora}`);
  } else {
    fechaCompleta = new Date(`${fecha}T${hora}`);
  }

  if (isNaN(fechaCompleta.getTime())) {
    console.error("Fecha inválida.");
    return null;
  }

  // Formatear la fecha según el tipo de input
  const anio = fechaCompleta.getFullYear();
  const mes = String(fechaCompleta.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaCompleta.getDate()).padStart(2, '0');
  const horas = String(fechaCompleta.getHours()).padStart(2, '0');
  const minutos = String(fechaCompleta.getMinutes()).padStart(2, '0');
  const segundos = String(fechaCompleta.getSeconds()).padStart(2, '0');

  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Lógica para el formato de 12 horas (AM/PM)
  const ampm = fechaCompleta.getHours() >= 12 ? 'pm' : 'am';
  let horas12 = fechaCompleta.getHours() % 12;
  horas12 = horas12 ? horas12 : 12; // La hora '0' debe ser '12'
  const horas12Padded = String(horas12).padStart(2, '0');

  switch (tipoInput) {
    case 'date':
      return `${anio}-${mes}-${dia}`;
    case 'time':
      return `${horas}:${minutos}`;
    case 'datetime-local':
      return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
    case 'DD de MMMM de YYYY HH:mm':
      return `${dia} de ${meses[fechaCompleta.getMonth()]} de ${anio} ${horas}:${minutos}`;
    case 'HH:mm ampm':
      return `${horas12Padded}:${minutos} ${ampm}`;
    case 'YYYY-MM-DD HH:mm:ss': // Formato para el caso
      return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    case 'DD/MM/YYYY HH:mm': // Formato para el caso
      return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    case 'DD/MM/YYYY HH:mm:ss': // Formato para el caso
      return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
    default:
      console.error("Tipo de formato no soportado.");
      return null;
  }
}
