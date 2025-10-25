let Html_Dashboard=`<section class="Dashboard">
    <section class="containner_Tarjetas_dashboard">
        <div class="Tarjeta_dashboard1 sub_card_Dashboard"> 
            <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card">50</div>
            <span class="info_sub_card">info2 </span>
            <span class="image_sub_card iconUnoStock-Productos_2"></span>
        </div>
        <div class="Tarjeta_dashboard2 sub_card_Dashboard">
            <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card">50</div>
            <span class="info_sub_card">info2 </span>
            <span class="image_sub_card iconUnoStock-advertencia"></span>
        </div>
        <div class="Tarjeta_dashboard3 sub_card_Dashboard"> 
            <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card">50</div>
            <span class="info_sub_card">info2 </span>
            <span class="image_sub_card icon-cotainer"><p class="icon-coin-dollar"></p></span>
        </div>
        <div class="Tarjeta_dashboard4 sub_card_Dashboard"> 
            <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card">50</div>
            <span class="info_sub_card">info2 </span>
            <span class="image_sub_card iconUnoStock-Movimientos"></span>
        </div>
    </section>
    <section class="container_Productos_Acciones_rapida">
        <div class="containner_Productos_con_bajo_Stock">
            <label class="Title_Productos_con_bajo_Stock">Productos con bajo Stock</label>
            <div class="container_registro_stock_para_dasboard">
            <div class="container_stock_dashboard">
                <div class="item_list_stock_dasboard data_item1">Producto</div>
                <div class="item_list_stock_dasboard data_item2">Categoria</div>
                <div class="item_list_stock_dasboard data_item3">Stock Actual</div>
                <div class="item_list_stock_dasboard data_item4">Estado</div>
            </div>
            <div class="list_data_stock_dashboard" id="data_list_data_stock_dashboard">
            </div>
        </div>
        </div>
        <div class="containner_Acciones_Rapidas">
            <label class="title_Acciones_Rapidas">Acciones Rapidas</label>
            <div class="sub_containner_Acciones_Rapidas">
                <button class="btn_Acciones_Rapidas" style="color:white; background:red;">+ Nuevo Producto</button> 
                <button class="btn_Acciones_Rapidas" style="color:white; background:blue;">+ Nuevo Movimento</button> 
                <button class="btn_Acciones_Rapidas" style="color:white; background:green;">Ajuste de Precio</button> 
                <button class="btn_Acciones_Rapidas" style="color:white; background:purple;">Generar Reporte</button>
            </div>
        </div>
    </section>
    <section class="containner_Movimientos_Recientes_dasboard">
        <label class="title_Movimientos_Recientes_dasboard">Movimientos Recientes</label>
        <div class="container_registro_movimiento_para_dasboard">
            <div class="container_historial_movimiento_dashboard">
                <div class="item_list_historial_movimiento_dasboard data_item1"> Fecha de Registro</div>
                <div class="item_list_historial_movimiento_dasboard data_item2">Tipo de Tansación </div>
                <div class="item_list_historial_movimiento_dasboard data_item3">Producto </div>
                <div class="item_list_historial_movimiento_dasboard data_item4">Cantidad </div>
                <div class="item_list_historial_movimiento_dasboard data_item5">Importe </div>
            </div>
            <div class="list_data_historial_movimiento_dashboard" id="data_list_historial_movimiento_dashboard">
            </div>
        </div>
    </section>

    <section class="containner_Precios_Ajustados_dasboard">
        <label class="title_Precios_Ajustados_dasboard">Precios Ajustados Dasboard</label>
        <div class="container_registro_Precios_Ajustados_dasboard">
            <div class="container_Precios_Ajustados_dasboard">
                <div class="item_list_Precios_Ajustados_dasboard data_item1">Producto</div>
                <div class="item_list_Precios_Ajustados_dasboard data_item2">Catejoria</div>
                <div class="item_list_Precios_Ajustados_dasboard data_item3">Stock Actual</div>
                <div class="item_list_Precios_Ajustados_dasboard data_item4">Precio de Compra</div>
                <div class="item_list_Precios_Ajustados_dasboard data_item5">Precio. V anterior</div>
                <div class="item_list_Precios_Ajustados_dasboard data_item6">Precio. V nuevo</div>
            </div>
            <div class="list_data_Precios_Ajustados_dashboard" id="data_list_Precios_Ajustados_dashboard">
            </div>
        </div>
    </section>

    <section class="containner_Proveedores_Recientes_dasboard">
        <label class="title_Proveedores_Recientes_dasboard">Proveedores Recientes</label>
        <div class="container_registro_Proveedores_Recientes_para_dasboard">
            <div class="container_Proveedores_Recientes_dasboard">
                <div class="item_list_Proveedores_dasboard data_item1">Proveedor</div>
                <div class="item_list_Proveedores_dasboard data_item2">Descripción</div>
                <div class="item_list_Proveedores_dasboard data_item3">Contacto</div>
            </div>
            <div class="list_data_Proveedores_Recientes_dashboard" id="data_list_Proveedores_Recientes_dashboard">
            </div>
        </div>
    </section>
</section>`;

function Dashboard(id){
    

    document.getElementById(id).innerHTML=Html_Dashboard;

    CargarDataMovimiento()
    CargarDatastock_dashboard()
    CargarDataPrecios_Ajustados_dashboard()
    CargarDataProveedores_Recientes__dashboard()
}


function CargarDatastock_dashboard(){
    let cant = 10;
    for(let i=0; i<cant;i++){

    document.getElementById("data_list_data_stock_dashboard").innerHTML+=`
    <div class="data_item_historial_Proveedores_dashboard">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>`
    }
}

function CargarDataMovimiento(){
    let cant = 5;
    for(let i=0; i<cant;i++){

    document.getElementById("data_list_historial_movimiento_dashboard").innerHTML+=`
        <div class="data_item_historial_movimiento_dashboard">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>`
    }
}
function CargarDataPrecios_Ajustados_dashboard(){
    let cant = 5;
    for(let i=0; i<cant;i++){

    document.getElementById("data_list_Precios_Ajustados_dashboard").innerHTML+=`
        <div class="data_item_Precios_Ajustados_dashboard">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>`
    }
}
function CargarDataProveedores_Recientes__dashboard(){
    let cant = 5;
    for(let i=0; i<cant;i++){

    document.getElementById("data_list_Proveedores_Recientes_dashboard").innerHTML+=`
        <div class="data_item_Proveedores_Recientes_dashboard">
            <span></span>
            <span></span>
            <span></span>
        </div>`
    }
}