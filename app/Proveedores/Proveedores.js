// proveedores.js (Código Funcional y Conectado - Corregido)

// NOTA: El HTML no tiene correcciones, se mantiene igual, pero los inputs 'riff' y 'direccion' se usarán consistentemente en el JS.
let Html_Proveedores = `
<section class="parent">
    <section class="section1 container-gestion">
        <h1 class="title-container-gestion">Resumen de Proveedores</h1>
        <button class="btn-agregar-proveedor" onclick="handleAgregarProveedor()">Nuevo Proveedor</button>   
        <div class="modal-overlay" id="modal">
            <div class="modal-content">
                <div id="formulario">
                    <h3 class="titulo-form" id="titulo-form">Nuevo Proveedor</h3>
                    <form class="form-proveedores" id="formProveedor">
                     <input type="hidden" id="edit_id" />
                        <label class="container-element-form1">
                            <span>Codigó Empresarial Riff</span>
                            <input type="text" class="input-form-proveedores" id="riff" placeholder="Codigó Empresarial o Riff" /> 
                        </label>         
                        <label class="container-element-form2">
                            <span>Nombre</span>
                            <input type="text" class="input-form-proveedores" id="nombre" placeholder="Nombre o Alias" required />
                        </label>
                        <label class="container-element-form3">
                            <span>Dirección</span>
                            <input type="text" class="input-form-proveedores" id="direccion" placeholder="Direción de la empresa" />
                        </label>
                        <label class="container-element-form4">
                            <span>Número de teléfono</span>
                            <input type="text" class="input-form-proveedores" id="telefono" placeholder="Número de teléfono" />
                        </label>
                        <label class="container-element-form5">
                            <span>Email</span>
                            <input type="text" class="input-form-proveedores" id="email" placeholder="example@gmail.com" />
                        </label>
                        <label class="container-element-form6">
                         <span>Descripción</span>
                            <textarea type="text" class="descripcion" id="descripcion" placeholder="Servicio, tipo de producto, etc"></textarea>
                        </label>
                        <div class="container-element-form7">
                         <button class="saveBoton" type="submit">Guardar</button>
                            <button class="close-btn" onclick="cerrarModal()">Cerrar</button>
                        </div>
       
                    </form>
                </div>
            </div>
        </div>
    </section>
    <section class="section2 container-proveedores-gestion">
        <div class="container-title-sub-gestion">
            <h2>Total de Proveedores:</h2>
            <span id="totalProveedores">0</span>
        </div>
        <div class="search-container-proveedores"> 
            <input type="text" id="search_name_proveedor" placeholder="Buscar por Nombre/Riff">
            <button class="btn-search-name-proveedor" id="btn_search_name_proveedor">Buscar</button>
        </div>
        <section class="tabla-proveedores" id="tabla-proveedores"> <thead>
                <div class="containner-info-proveedores">  
                    <label>cod_Empresa</label>
                    <label>Nombre</label>
                    <label>Descripcion</label>
                    <label>Direccion</label>
                    <label>correo</label>
                    <label>Telefono</label>
                    <label>Acciones</label>
                </div>
                <div class="sub-element-proveedores" id="sub-element-proveedores">
                </div>
        </section>
    </section>
</section>`;

// Mapeo de columnas de la DB: key, Nombre, Riff, Telefono, correo (Email), Direccion
// Usaremos 'key' como ID único.

function Proveedores(id) {
    document.getElementById(id).innerHTML = Html_Proveedores;

    // --- 1. Captura de Eventos ---
    const form = document.getElementById("formProveedor");
    const input_search = document.getElementById("search_name_proveedor");
    const btn_buscar = document.getElementById("btn_search_name_proveedor");

    // --- 2. Manejo de Submisión del Formulario (Guardar/Actualizar) ---
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const id_proveedor = document.getElementById("edit_id").value;
        const riff = document.getElementById("riff").value; // 👈 CORRECCIÓN: Captura de Riff
        const nombre = document.getElementById("nombre").value;
        const direccion = document.getElementById("direccion").value; // 👈 CORRECCIÓN: Uso consistente de 'direccion'
        const descripcion = document.getElementById("descripcion").value; // Se mantiene la descripción, pero 'Direccion' va al campo DB
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;

        // 🎯 APLICANDO VALIDACIÓN DE DATOS ANTES DE ENVIAR
        if (!validarFormulario(nombre, telefono, email)) {
            return;
        }

        const proveedorData = {
            key: id_proveedor, // key de la DB
            Riff: riff, // 👈 Se agrega Riff
            Nombre: nombre,
            Direccion: direccion, // Usamos 'direccion' (del input) para la DB
            Descripcion: descripcion, // Se incluye la descripción, si la DB tiene un campo para ella
            Telefono: telefono,
            correo: email // Usamos email como correo
        };

        // NOTA: Si la DB solo tiene 5 columnas, solo envía 'key', 'Nombre', 'Riff', 'Telefono', 'correo', 'Direccion'
        if (id_proveedor) {
            console.log(id_proveedor)
            // Si hay ID, es una ACTUALIZACIÓN
           api.send('Actualizar-proveedor', proveedorData);
        } else {
            // Si no hay ID, es un NUEVO REGISTRO
            api.send('Guardar-proveedor', proveedorData);
        }

        cerrarModal();
        form.reset();
    });

    // --- 3. Manejo de Búsqueda (Implementación Pendiente en el Main Process) ---
    if (btn_buscar) {
        btn_buscar.addEventListener("click", () => {
            const nombreBuscado = input_search.value.trim();
            if (nombreBuscado) {
                // Enviar señal IPC para buscar
                api.send('Buscar-input-text-proveedor', nombreBuscado);
            } else {
                // Si el campo está vacío, refrescar la lista completa
                api.send("solicitud-data-proveedores");
            }
        });
    }

    // --- 4. Solicitud Inicial de Datos ---
    api.send("solicitud-data-proveedores"); // 👈 CORRECCIÓN: Mover la solicitud de datos dentro de la función Proveedores
}

// 🌟 FUNCIÓN DE VALIDACIÓN FRONT-END 🌟
function validarFormulario(nombre, telefono, email) {
    // ... (El código de validación se mantiene igual, ya estaba correcto)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^\d+$/;

    if (nombre.trim() === "") {
        alert("El Nombre del proveedor no puede estar vacío.");
        api.send('window-force-focus-cycle');
        return false;
    }

    if (telefono.trim() === "") {
        alert("El Teléfono no puede estar vacío.");
        api.send('window-force-focus-cycle');
        return false;
    }

    if (!telefonoRegex.test(telefono.trim())) {
        alert("El Teléfono debe contener solo dígitos numéricos.");
        api.send('window-force-focus-cycle');
        return false;
    }

    if (email.trim() !== "" && !emailRegex.test(email.trim())) {
        alert("El Email debe tener un formato válido (ej: correo@dominio.com).");
        api.send('window-force-focus-cycle');
        return false;
    }

    return true;
}
/* ------------------------------------------------------------------ */
/* ----------- RECEPCIÓN DE DATOS DEL PROCESO PRINCIPAL (IPC) ------- */
/* ------------------------------------------------------------------ */

api.receive("proveedores-data", (event, data) => {
    console.log('proveedores-data recibida y renderizando:', data);

    const tbody = document.getElementById("sub-element-proveedores");
    const totalSpan = document.getElementById("totalProveedores");

    // Limpiar y renderizar
    tbody.innerHTML = "";
    totalSpan.textContent = data.length;

    if (data.length === 0) {
        const filaVacia = document.createElement("label");
        const celda = document.createElement("span");
        celda.colSpan = 6; // 👈 CORRECCIÓN: Colspan ajustado a 6 (Proveedor, Riff, Dirección/Desc, Teléfono, Email, Acciones)
        celda.style.textAlign = "center";
        celda.style.padding = "10px";
        celda.textContent = "No se encontraron proveedores.";
        filaVacia.appendChild(celda);
        tbody.appendChild(filaVacia);
        return;
    }

    data.forEach((p) => {
        const nuevaFila = document.createElement("article");
        nuevaFila.className="article-proveedores"

        // Riff
        const celdaRiff = document.createElement("span"); // 👈 CORRECCIÓN: Se agrega Riff a la tabla
        celdaRiff.textContent = p.cod_Empresa || 'N/A';
        nuevaFila.appendChild(celdaRiff);

        // Nombre
        const celdaNombre = document.createElement("span");
        celdaNombre.textContent = p.Nombre || 'N/A';
        nuevaFila.appendChild(celdaNombre);
        
        // Dirección
        const celdaDireccion = document.createElement("span"); 
        celdaDireccion.textContent = p.Direccion || 'N/A'; // Usa Direccion o Descripcion (lo que venga de la DB)
        nuevaFila.appendChild(celdaDireccion);

        //Descripción (Se asume que la descripción del proveedor en la lista es la dirección, o un resumen)       
        const celdaDescripcion = document.createElement("span"); 
        celdaDescripcion.textContent = p.Descripcion || 'N/A'; // Usa Direccion o Descripcion (lo que venga de la DB)
        nuevaFila.appendChild(celdaDescripcion);

        // Email
        const celdaEmail = document.createElement("span");
        celdaEmail.textContent = p.correo || 'N/A';
        nuevaFila.appendChild(celdaEmail);

        // Teléfono
        const celdaTelefono = document.createElement("span");
        celdaTelefono.textContent = p.Telefono || 'N/A';
        nuevaFila.appendChild(celdaTelefono);

        // Acciones
        const celdaAcciones = document.createElement("span");
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn-action-proveedor iconUnoStock-edit";
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => handleEditarProveedor(p.key);

        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn-action-proveedor iconUnoStock-delete";
        btnBorrar.textContent = "Borrar";
        btnBorrar.onclick = () => handleBorrarProveedor(p.key);

        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnBorrar);
        nuevaFila.appendChild(celdaAcciones);

        tbody.appendChild(nuevaFila);
    });
});

// ... (El resto del código se mantiene igual ya que las funciones auxiliares estaban bien)

// 🚀 RECEPTOR PARA LA SEÑAL DE OPERACIÓN COMPLETADA
// Ejecuta el refresco de datos manual Y el arreglo de foco.
api.receive('proveedor-operacion-completa', () => {
    console.log("Señal de operación completada recibida. Solicitando data y foco.");
    handleForceFocus(); // 1. Arregla el foco
    api.send("solicitud-data-proveedores"); // 2. Realiza el refresco de datos manual
});


/* ------------------------------------------------------------------ */
/* ---------------- FUNCIONES DE ACCIÓN PARA BOTONES ---------------- */
/* ------------------------------------------------------------------ */

// 🔓 FUNCIÓN DE ENFOQUE (Electron/UI)
function handleForceFocus() {
    console.log("Solicitando ciclo de enfoque al main process...");
    api.send('window-force-focus-cycle');
}

// Abre el modal para NUEVO REGISTRO
function handleAgregarProveedor() {
    document.getElementById("titulo-form").textContent = "Nuevo Proveedor";
    document.getElementById("edit_id").value = "";
    document.getElementById("formProveedor").reset();
    abrirModal();
}

// Lógica para EDITAR (Solicita los datos del proveedor y abre el modal)
function handleEditarProveedor(id) {
    console.log("Solicitando datos para editar proveedor ID:", id);
    document.getElementById("titulo-form").textContent = "Editar Proveedor";

    // Enviar una señal IPC para obtener los datos del proveedor específico
    api.send('solicitud-proveedor-by-id', id);
}

// Recibe los datos del proveedor desde el Main Process y llena el formulario
api.receive('proveedor-data-to-edit', (event, proveedor) => {
    if (proveedor) {
        document.getElementById("edit_id").value = proveedor.key;
        document.getElementById("riff").value = proveedor.cod_Empresa || ''; // 👈 CORRECCIÓN: Llenar el campo Riff
        document.getElementById("nombre").value = proveedor.Nombre;
        document.getElementById("direccion").value = proveedor.Direccion || ''; // 👈 CORRECCIÓN: Llenar el campo Dirección
        document.getElementById("descripcion").value = proveedor.Descripcion || ''; // Se llena el campo de texto libre
        document.getElementById("telefono").value = proveedor.Telefono || '';
        document.getElementById("email").value = proveedor.correo || '';
        abrirModal();
    } else {
        console.error("No se encontraron datos para editar el proveedor.");
    }
});


// Lógica para BORRAR 
function handleBorrarProveedor(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
        console.log("Enviando comando para borrar proveedor ID:", id);
        api.send('open-Borrar-proveedor', id);
    }
}


/* ------------------------------------------------------------------ */
/* --------------------- LÓGICA DEL MODAL --------------------------- */
/* ------------------------------------------------------------------ */

function abrirModal() {
    document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
    // Limpia el ID de edición al cerrar
    document.getElementById("edit_id").value = "";
    document.getElementById("formProveedor").reset();
}