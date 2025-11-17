

let Html_Dashboard = `

<section class="Dashboard">
    <section class="containner_Tarjetas_dashboard">
        <div class="Tarjeta_dashboard1 sub_card_Dashboard"> 
            <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card" id="total_productos">50</div>
            <span class="info_sub_card"></span>
            <span class="image_sub_card iconUnoStock-Productos_2"></span>
        </div>
        <div class="Tarjeta_dashboard2 sub_card_Dashboard">
            <label class="title_sub_card">Stock Bajo</label>
            <div class="number_estado_sub_card" id="total_productos_bajo">50</div>
            <span class="info_sub_card" style="color:red; font-weight:bold">Requiere Atención</span>
            <span class="image_sub_card iconUnoStock-advertencia"></span>
        </div>
        <div class="Tarjeta_dashboard3 sub_card_Dashboard"> 
            <label class="title_sub_card" >Valor Total</label>
            <div class="number_estado_sub_card" id="valor_total_producto">50</div>
            <span class="info_sub_card"></span>
            <span class="image_sub_card icon-cotainer"><p class="icon-coin-dollar"></p></span>
        </div>
        <div class="Tarjeta_dashboard4 sub_card_Dashboard"> 
            <label class="title_sub_card">Movimientos Hoy</label>
            <div class="number_estado_sub_card">50</div>
            <span class="info_sub_card" style="color:blue; font-weight:bold"><span id="valor_movimieno_entrada">0</span> entradas y <span id="valor_movimieno_salida">0</span> salidas</span>
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
                <button class="btn_Acciones_Rapidas_Nuevo_Producto">+ Nuevo Producto</button>
                <button class="btn_Acciones_Rapidas_Nuevo_Movimiento">+ Nuevo Movimento</button>
                <button class="btn_Acciones_Rapidas_Ajuste_Precio">Ajuste de Precio</button>
                <button class="btn_Acciones_Rapidas_Generar_Reporte">Generar Reporte</button>
            </div>
        </div>
    </section>
  
    <section class="containner-data-dasboard">
             <!---------->
            <section class="containner_Movimientos_Recientes_dasboard">
                <label class="title_Movimientos_Recientes_dasboard">Movimientos Recientes</label>
                <div class="container_registro_movimiento_para_dasboard">
                    <div class="container_historial_movimiento_dashboard">
                        <div class="item_list_historial_movimiento_dasboard data_item1">N</div>
                        <div class="item_list_historial_movimiento_dasboard data_item1">Tipo de Tansación</div>
                        <div class="item_list_historial_movimiento_dasboard data_item2">Descripción </div>
                        <div class="item_list_historial_movimiento_dasboard data_item3">Fecha de Registro</div>
                    </div>
                    <div class="list_data_historial_movimiento_dashboard" id="data_list_historial_movimiento_dashboard">
                    </div>
                </div>
            </section>
            <!--
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
            -->
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
            <!-----
            <section class="container-grafias">
                <div class="sub-containner-grafica">
                     <h2>Cantidad de Productos por Categoria</h2>
                      <canvas id="productosChart"></canvas>
                      </div>

                <div class="sub-containner-grafica">
                    <h2>Movimientos por Día</h2>
                    <canvas id="movimientosChart"></canvas>
                </div>

                <div class="sub-containner-grafica">
                    <h2>Cantidad vendida por producto</h2>
                    <canvas id="cantidadChart"></canvas>
                </div>

                <div class="sub-containner-grafica">
                          <h2>Ingresos por producto</h2>
                          <canvas id="ingresosChart"></canvas>
                </div>
            </section>
    </section>----->

</section>`;








function Dashboard(id) {
  
   document.getElementById(id).innerHTML = Html_Dashboard;

    api.send('get-informacion-dasboard')
   // api.send('get-informacion-movimiento-dasboard')
}

api.receive("productos-data-total-productos",(event,data)=>{


        /*****
        [
          {
            total_general_productos: 41,
            total_productos_stock_bajo: 7,
            valor_total_todos_productos: 2583.37
          }
        ]
         console.log('productos-data-total-productos',data_total_producto)
        **********/
   
        document.getElementById("total_productos").innerHTML=data[0].total_general_productos
        document.getElementById("total_productos_bajo").innerHTML=data[0].total_productos_stock_bajo
        document.getElementById("valor_total_producto").innerHTML=data[0].valor_total_todos_productos+"Bs"

})

api.receive('productos-data-list-productos',(event,data_total_list)=>{

    if(data_total_list.length>0){

    data_total_list.forEach((producto,item)=>{

          document.getElementById("data_list_data_stock_dashboard").innerHTML += `
                <div class="data_item_historial_Proveedores_dashboard">
                    <span>${producto.nombre}</span>
                    <span>${producto.categoria}</span>
                    <span style="color:red;  font-weight:bold">${producto.cant}</span>
                    <span>Agotado</span>
                </div>`

        })
    }else{

        document.getElementById("data_list_data_stock_dashboard").innerHTML += `<h1 style="color:white">No Data</h1>`;
    }


})


api.receive('movimientos-data-actividad',(event,data)=>{

    document.getElementById("valor_movimieno_entrada").innerHTML=data[0].movimientos_hoy
    document.getElementById("valor_movimieno_salida").innerHTML=data[0].movimientos_ayer

})

api.receive('movimientos-data-list',(event,data)=>{

    if(data.length>0){

        data.forEach((movimiento,item)=>{

            document.getElementById("data_list_historial_movimiento_dashboard").innerHTML += `
                <div class="data_item_historial_movimiento_dashboard">
                    <span>${movimiento.id}</span>
                    <span>${movimiento.tipo}</span>
                    <span>${movimiento.descripcion}</span>
                    <span>${convertirAFormato(movimiento.fecha,"DD/MM/YYYY HH:mm:ss")}</span>
                </div>`

        })

    }else{

    document.getElementById("data_list_data_stock_dashboard").innerHTML += `<h1 style="color:white">No Data</h1>`;
        }

})


/*------------------------------*/
