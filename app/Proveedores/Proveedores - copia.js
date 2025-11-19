// proveedores.js (Código Funcional y Conectado - Corregido)

let Html_Proveedores = `
<section class="parent">
    <section class="section1 container-gestion">
        <h1 class="title-container-gestion">Resumen de Proveedores</h1>
        <button class="btn-agregar-proveedor" onclick="handleAgregarProveedor()">Nuevo Proveedor</button>    
        <div class="modal-overlay" id="modal">
            <div class="modal-content">
                <span class="close-btn" onclick="cerrarModal()">×</span>
                <div id="formulario">
                    <h3 id="titulo-form">Nuevo Proveedor</h3>
                    <form id="formProveedor"> <input type="hidden" id="edit_id" />
                        <label>Codigó Empresarial Riff</label>
                        <input type="text" id="riff" placeholder="Codigó Empresarial o Riff" />           
                        <label>Nombre</label>
                        <input type="text" id="nombre" placeholder="Nombre o Alias" required />
                        <label>Dirección</label>
                        <input type="text" id="direccion" placeholder="Direción de la empresa" />
                        <label>Número de teléfono</label>
                        <input type="text" id="telefono" placeholder="Número de teléfono" />
                        <label>Email</label>
                        <input type="text" id="email" placeholder="example@gmail.com" />
                        <label>Descripción</label>
                        <textarea type="text" id="descripcion" placeholder="Servicio, tipo de producto, etc"></textarea>
                        <button class="saveBoton" type="submit">Guardar</button>
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
        <table id="tabla-proveedores"> <thead>
                <tr>
                    <th>Proveedor</th>
                    <th>Descripción</th>
                    <th>Número de teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                </tbody>
        </table>
    </section>
</section>`;

// Mapeo de columnas de la DB: key, Nombre, Telefono, correo (Email), Direccion (Descripción o contacto)
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
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value; // Direccion
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;

        // 🎯 APLICANDO VALIDACIÓN DE DATOS ANTES DE ENVIAR
        if (!validarFormulario(nombre, telefono, email)) {
            // Si la validación falla, detenemos el proceso aquí.
            return;
        }

        const proveedorData = {
            id: id_proveedor, // key de la DB
            nombre: nombre,
            direccion: descripcion, // Usamos descripcion como Direccion/Contacto
            telefono: telefono,
            correo: email // Usamos email como correo
        };

        if (id_proveedor) {
            // Si hay ID, es una ACTUALIZACIÓN
            api.send('Actualizar-proveedor', proveedorData);
        } else {
            // Si no hay ID, es un NUEVO REGISTRO
            api.send('Guardar-proveedor', proveedorData);
        }

        cerrarModal();
        form.reset();
    });
    // --- 4. Solicitud Inicial de Datos ---
    api.send("solicitud-data-proveedores");
}

// 🌟 FUNCIÓN DE VALIDACIÓN FRONT-END 🌟
function validarFormulario(nombre, telefono, email) {
    // Expresión regular simple para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Expresión regular para validar que el teléfono solo tenga números
    const telefonoRegex = /^\d+$/;

    if (nombre.trim() === "") {
        alert("El Nombre del proveedor no puede estar vacío.");
        api.send('window-force-focus-cycle'); // 👈 CORRECCIÓN APLICADA AQUÍ
        return false;
    }

    if (telefono.trim() === "") {
        alert("El Teléfono no puede estar vacío.");
        api.send('window-force-focus-cycle'); // 👈 CORRECCIÓN APLICADA AQUÍ
        return false;
    }

    if (!telefonoRegex.test(telefono.trim())) {
        alert("El Teléfono debe contener solo dígitos numéricos.");
        api.send('window-force-focus-cycle'); // 👈 CORRECCIÓN APLICADA AQUÍ
        return false;
    }

    if (email.trim() !== "" && !emailRegex.test(email.trim())) {
        alert("El Email debe tener un formato válido (ej: correo@dominio.com).");
        api.send('window-force-focus-cycle'); // 👈 CORRECCIÓN APLICADA AQUÍ
        return false;
    }

    return true;
}
/* ------------------------------------------------------------------ */
/* ----------- RECEPCIÓN DE DATOS DEL PROCESO PRINCIPAL (IPC) ------- */
/* ------------------------------------------------------------------ */

api.receive("proveedores-data", (event, data) => {
    console.log('proveedores-data recibida y renderizando:', data);

    const tbody = document.getElementById("tabla-proveedores").querySelector("tbody");
    const totalSpan = document.getElementById("totalProveedores");

    // Limpiar y renderizar
    tbody.innerHTML = "";
    totalSpan.textContent = data.length;

    if (data.length === 0) {
        const filaVacia = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 5;
        celda.style.textAlign = "center";
        celda.style.padding = "10px";
        celda.textContent = "No se encontraron proveedores.";
        filaVacia.appendChild(celda);
        tbody.appendChild(filaVacia);
        return;
    }

    data.forEach((p) => {
        const nuevaFila = document.createElement("tr");

        // Nombre
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = p.Nombre || 'N/A';
        nuevaFila.appendChild(celdaNombre);

        // Descripción/Dirección
        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = p.Direccion || 'N/A';
        nuevaFila.appendChild(celdaDescripcion);

        // Teléfono
        const celdaTelefono = document.createElement("td");
        celdaTelefono.textContent = p.Telefono || 'N/A';
        nuevaFila.appendChild(celdaTelefono);

        // Email
        const celdaEmail = document.createElement("td");
        celdaEmail.textContent = p.correo || 'N/A';
        nuevaFila.appendChild(celdaEmail);

        // Acciones
        const celdaAcciones = document.createElement("td");
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

// 🚀 CORREGIDO: RECEPTOR PARA LA SEÑAL DE OPERACIÓN COMPLETADA
// Ejecuta el refresco de datos manual Y el arreglo de foco.
api.receive('proveedor-operacion-completa', () => {
    console.log("Señal de operación completada recibida. Solicitando data y foco.");
    handleForceFocus(); // 1. Arregla el foco
    api.send("solicitud-data-proveedores"); // 2. Realiza el refresco de datos manual
});


/* ------------------------------------------------------------------ */
/* ---------------- FUNCIONES DE ACCIÓN PARA BOTONES ---------------- */
/* ------------------------------------------------------------------ */

// 🔓 NUEVO: FUNCIÓN DE ENFOQUE (Electron/UI)
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
        document.getElementById("nombre").value = proveedor.Nombre;
        document.getElementById("descripcion").value = proveedor.Direccion || '';
        document.getElementById("telefono").value = proveedor.Telefono || '';
        document.getElementById("email").value = proveedor.correo || '';
        abrirModal();
    } else {
        console.error("No se encontraron datos para editar el proveedor.");
    }
});


// Lógica para BORRAR (Envía la señal IPC de borrado y se apoya en el listener de operación-completa para el foco)
function handleBorrarProveedor(id) {
    // Usamos el diálogo nativo, el problema de foco se resuelve con la señal IPC después de la operación.
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