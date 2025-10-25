
let Html_Proveedores=`
<section class="Proveedor">
    <section class="section1 container-gestion"> 
        <h1 class="title-container-gestion">Total de Productos</h1>
        <button class="btn-agregar-proveedor">+ Añadir Proveedor</button>
    </section>
    <section class="section2 container-proveedores-gestion">
            <div class="sub-container-action-proveedor">
                <div class="containner-search-proveedor">
                    <div class="search-proveedor">
                        <input id="search_name" class="search-name" type="search" name="" placeholder="Busquar Proveedor" >
                        <button class="btn-search" id="btn_search_name" ><i class="icon-search"></i></button>
                    </div> 
                    <select class="Select-filtros">
                        <option select>Filtros</option>
                        <option >Granos</option>
                        <option >Carne</option>
                    </select>
                </div> 
                <div class="container-title-sub-gestion">
                    <h2>Total de Proveedores</h2>
                    <span>0</span>
                </div>
            </div>
            <div class="container-registro-Proveedores">
                    <div class="item-list-proveedores data-item1">Proveedor</div>
                    <div class="item-list-proveedores data-item2">Categoria</div>
                    <div class="item-list-proveedores data-item3">Contacto</div>
                    <div class="item-list-proveedores data-item4">Ultima Orden</div>
                    <div class="item-list-proveedores data-item5">Acciones </div>
                    <div class="list-data-proveedores" id="list_data_proveedores"> </div>
            </div>
    </section>
</section>`;
/*------------------------------------------------*/
function Proveedores(id){
  document.getElementById(id).innerHTML=Html_Proveedores;  
  let cant = 20;
    for(let i=0; i<cant;i++){

        document.getElementById("list_data_proveedores").innerHTML+=`<div class="data-item-proveedor">
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
