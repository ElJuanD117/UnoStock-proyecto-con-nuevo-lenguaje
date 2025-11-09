
let Html_Proveedores = `
<section class="parent">
    <section class="section1 container-gestion">
        <h1 class="title-container-gestion">Resumen de Proveedores</h1>
        <button class="btn-agregar-proveedor" onclick="abrirModal()">Nuevo Proveedor</button>
        <div class="modal-overlay" id="modal">
            <div class="modal-content">
                <span class="close-btn" onclick="cerrarModal()">×</span>
                <div id="formulario">
                    <h3 id="titulo-form">Nuevo Proveedor</h3>
                    <form id="formUsuario">
                        <input type="hidden" id="edit_id" />

                        <label>Nombre</label>
                        <input type="text" id="nombre" placeholder="Nombre o Alias" required />

                        <label>Descripción</label>
                        <input type="text" id="descripcion" placeholder="Servicio, tipo de producto, etc " />

                        <label>Número de teléfono</label>
                        <input type="text" id="telefono" placeholder="Número de teléfono" />

                        <label>Email</label>
                        <input type="text" id="email" placeholder="example@gmail.com" />

                        <button class="saveBoton" type="submit">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
        <script src="Proveedores.js">
            abrirModal()
            cerrarModal()
        </script>
    </section>
    <section class="section2 container-proveedores-gestion">
        <div class="sub-container-action-proveedor">
            <div class="container-title-sub-gestion">
                <h2>Total de Proveedores</h2>
                <span>0</span>
            </div>
        </div>
        <table id="tabla-usuarios">
            <thead>
                <tr>
                    <th>Proveedor</th>
                    <th>Descripción</th>
                    <th>Número de teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <td>JuanSoles</td>
                <td>Ingredientes</td>
                <td>0412-3961482</td>
                <td>Juandiegosoles@gmail.com</td>
                <td>Edit Borrar</td>
            </tbody>
        </table>
    </section>
</section>`;
/*------------------------------------------------*/
function Proveedores(id) {
    document.getElementById(id).innerHTML = Html_Proveedores;
    let cant = 20;
    for (let i = 0; i < cant; i++) {

        document.getElementById("list_data_proveedores").innerHTML += `<div class="data-item-proveedor">
            <span>item</span>
            <span>item</span>
            <span>item</span>
            <span>item</span>
            <span class="span-action-proveedor">
                <button class="btn-action-proveedor iconUnoStock-edit"></button>
                <button class="btn-action-proveedor iconUnoStock-delete"></button>
            </span>
        </div>`
    }
}

// Añadir Proveedores modal

function abrirModal() {
    // Asegurarse de que el formulario esté listo (limpio) y luego mostrar el overlay
    if (typeof mostrarFormulario === 'function') mostrarFormulario();
    document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
    // Oculta el overlay completamente y vuelve a mostrar el formulario internamente
    document.getElementById("modal").style.display = "none";
    // Asegurarse de que el formulario esté visible la próxima vez que se abra
    const formulario = document.getElementById('formulario');
    if (formulario) formulario.style.display = 'block';
}
