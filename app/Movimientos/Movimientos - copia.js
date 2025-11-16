let Html_Movimiento= `
<section class="Movimiento-container">
    <section class="section_Movimiento1 sub_card_Movimiento"> 
        <label class="title_sub_card">Ingreso del mes</label>
        <div class="number_estado_sub_card">50</div>
        <span class="info_sub_card">info2 </span>
        <span class="image_sub_card icon-arrow-up"></span>
    </section>
    <section class="section_Movimiento2 sub_card_Movimiento">
        <label class="title_sub_card">Gastos del mes</label>
        <div class="number_estado_sub_card">50</div>
        <span class="info_sub_card">info2 </span>
        <span class="image_sub_card icon-arrow-down"></span>
    </section>
    <section class="section_Movimiento3 sub_card_Movimiento"> 
        <label class="title_sub_card">Balance Neto</label>
        <div class="number_estado_sub_card">50</div>
        <span class="info_sub_card">info2 </span>
        <span class="image_sub_card iconUnoStock-balanza"></span>
    </section>
    <section class="section_Movimiento4 sub_card_Movimiento"> 
        <label class="title_sub_card">Transaciones</label>
        <div class="number_estado_sub_card">50</div>
        <span class="info_sub_card">info2 </span>
        <span class="image_sub_card iconUnoStock-lista"></span>
    </section>
    <section class="section_Movimiento5  containner_historial_Movimientos_Recientes">
        <label class="title_historial_Movimientos_Recientes">Historial Movimientos</label>
        <div class="container-registro-movimiento">
                <div class="item-list-historial-movimiento data-item1"> Fecha de Registro</div>
                <div class="item-list-historial-movimiento data-item2">Tipo de Tansación </div>
                <div class="item-list-historial-movimiento data-item3">Producto </div>
                <div class="item-list-historial-movimiento data-item4">Cantidad </div>
                <div class="item-list-historial-movimiento data-item5">Importe </div>
                <div class="item-list-historial-movimiento data-item6">Acciones </div>
                <div class="list-data" id="list_data_historial_movimiento"> </div>
        </div>
</section>
</section>`;


function Movimientos(id){

 document.getElementById(id).innerHTML=Html_Movimiento;

 CargarData()
}


function CargarData(){
    let cant = 20;
    for(let i=0; i<cant;i++){

    document.getElementById("list_data_historial_movimiento").innerHTML+=`<div class="data-item">
            <span>item</span>
            <span>item</span>
            <span>item</span>
            <span>item</span>
            <span>item</span>
            <span class="span-action">
            <button class="btn-action-history iconUnoStock-edit"></button>
            <button class="btn-action-history iconUnoStock-delete"></button>
            </span>
        </div>`
    }
}