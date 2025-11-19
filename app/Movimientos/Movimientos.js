let Html_Movimiento= `

<section class="Movimiento-container">
    <section class="section_Movimiento1 sub_card_Movimiento"> 
           <label class="title_sub_card">Total de Productos</label>
            <div class="number_estado_sub_card" id="total_productos">50</div>
            <span class="info_sub_card"></span>
            <span class="image_sub_card iconUnoStock-Productos_2"></span>
    </section>
    <section class="section_Movimiento2 sub_card_Movimiento">
          <label class="title_sub_card">Stock Bajo</label>
            <div class="number_estado_sub_card" id="total_productos_bajo">50</div>
            <span class="info_sub_card" style="color:red; font-weight:bold">Requiere Atención</span>
            <span class="image_sub_card iconUnoStock-advertencia"></span>
    </section>
    <section class="section_Movimiento3 sub_card_Movimiento"> 
            
            <label class="title_sub_card" >Valor Total</label>
            <div class="number_estado_sub_card" id="valor_total_producto">50</div>
            <span class="info_sub_card"></span>
            <span class="image_sub_card icon-cotainer"><p class="icon-coin-dollar"></p></span>
    </section>
    <section class="section_Movimiento4 container-grafias-movimientos">
                <div class="sub-containner-grafica-movimiento">
                    <div> 
                                 <h2>Cantidad de Productos por Categoria</h2>
                      <canvas class="canvas-movimientos" id="productosChart"></canvas>
                    </div> 
                </div>

                <div class="sub-containner-grafica-movimiento">
                          <h2>Ingresos por producto</h2>
                                    <div> 
                         <canvas class="canvas-movimientos" id="ingresosChart" width="222" height="248" style="display: block;box-sizing: border-box;height: 248px;width: 211px;"></canvas>
                </div>     
                </div>     
    </section>
    <section class="section_Movimiento5">
            <section class="containner_Movimientos_Recientes">
                <label class="title_Movimientos_Recientes">Historial Movimientos</label>
                <div class="container-registro-movimiento">
                        <div class="item_list_movimiento">N</div>
                        <div class="item_list_movimiento">Tipo de Tansación</div>
                        <div class="item_list_movimiento">Descripción </div>
                        <div class="item_list_movimiento">Fecha de Registro</div>
                </div>
                <div class="list-data" id="list_data_movimiento"> </div>
            </section>
            <section class="containner_detalles_de_venta">
                <label class="title_historial_detalles_de_venta">Detalles de Ventas</label>
                <div class="container-registro-detalles_de_venta">
                      <div class="item-list-detalles-de-venta data-item0">N</div>
                      <div class="item-list-detalles-de-venta data-item1">venta_id</div>
                      <div class="item-list-detalles-de-venta data-item2">cod</div>
                      <div class="item-list-detalles-de-venta data-item3">producto</div>
                      <div class="item-list-detalles-de-venta data-item4">cantidad</div>
                      <div class="item-list-detalles-de-venta data-item5">precio</div>
                      <div class="item-list-detalles-de-venta data-item6">descuento</div>
                      <div class="item-list-detalles-de-venta data-item7">total</div>
                      
                </div>
                <div class="list-data-detalles-de-venta" id="list_data_detalles_de_venta"> </div>
            </section>
    </section>

</section>`;


function Movimientos(id){

        document.getElementById(id).innerHTML=Html_Movimiento;

        api.send("obtener-datos-area-movimientos")
api.send('getProductos')
api.send('getingresos')
}

/*
api.receive("",(event,data)=>{

})
*/
api.receive("Informacion-de-datos-movimientos-productos",(event,data)=>{

    console.log(data)
    document.getElementById("total_productos").innerHTML=data[0].total_general_productos
    document.getElementById("total_productos_bajo").innerHTML=data[0].total_productos_stock_bajo
    document.getElementById("valor_total_producto").innerHTML=data[0].valor_total_todos_productos.toFixed(2)+"Bs"


})
api.receive("Informacion-de-datos-movimientos",(event,data)=>{

    //console.log(data)
    data.forEach((movimiento,item)=>{

        document.getElementById("list_data_movimiento").innerHTML += `
            <div class="data_item_movimiento">
                <span>${movimiento.id}</span>
                <span>${movimiento.tipo}</span>
                <span>${movimiento.descripcion}</span>
                <span>${convertirAFormato(movimiento.fecha,"DD/MM/YYYY HH:mm:ss")}</span>
            </div>`

    })

})

api.receive("Informacion-de-datos-detalle_venta",(event,data)=>{

        data.forEach((detalle_venta,item)=>{

            document.getElementById("list_data_detalles_de_venta").innerHTML+=`
                <div class="data-item-detalles-de-venta">
                    <span>${detalle_venta.id}</span>
                    <span>${detalle_venta.venta_id}</span>
                    <span>${detalle_venta.cod}</span>
                    <span>${detalle_venta.producto}</span>
                    <span>${detalle_venta.cantidad}</span>
                    <span>${detalle_venta.precio}Bs</span>
                    <span>${detalle_venta.descuento}Bs</span>
                    <span>${detalle_venta.total}Bs</span>
                </div>`
        })
})


/*-----------------------------------------------*/

/*
bar · line · radar · polarArea · pie · doughnut · bubble
*/


api.receive("Grafico-productos",(event,data)=>{

  const categorias = data.map(d => d.categoria);
  const cantidades = data.map(d => d.cantidad);

  new Chart(document.getElementById('productosChart'), {
    type: 'bar',
    data: {
      labels: categorias,
      datasets: [{
        label: 'Cantidad de productos',
        data: cantidades,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    }
  });




})

api.receive("Grafico-ingresos",(event,data)=>{
const productos = data.map(d => d.producto);
  const ingresos = data.map(d => d.ingresos);

  new Chart(document.getElementById('ingresosChart'), {
    type: 'pie',
    data: {
      labels: productos,
      datasets: [{
        label: 'Ingresos',
        data: ingresos,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  });

})
