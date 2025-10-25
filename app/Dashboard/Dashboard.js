let Html_Dashboard=`
<section class="Dashboard">
	<section class="section_dasboard1 sub_card_Dashboard"> 
		<label class="title_sub_card">Total de Productos</label>
		<div class="number_estado_sub_card">50</div>
		<span class="info_sub_card">info2 </span>
		<span class="image_sub_card iconUnoStock-Productos_2"></span>
	</section>
	<section class="section_dasboard2 sub_card_Dashboard">
		<label class="title_sub_card">Total de Productos</label>
		<div class="number_estado_sub_card">50</div>
		<span class="info_sub_card">info2 </span>
		<span class="image_sub_card iconUnoStock-advertencia"></span>
	</section>
	<section class="section_dasboard3 sub_card_Dashboard"> 
		<label class="title_sub_card">Total de Productos</label>
		<div class="number_estado_sub_card">50</div>
		<span class="info_sub_card">info2 </span>
		<span class="image_sub_card icon-cotainer"><p class="icon-coin-dollar"></p></span>
	</section>
	<section class="section_dasboard4 sub_card_Dashboard"> 
		<label class="title_sub_card">Total de Productos</label>
		<div class="number_estado_sub_card">50</div>
		<span class="info_sub_card">info2 </span>
		<span class="image_sub_card iconUnoStock-Movimientos"></span>
	</section>
	<section class="section_dasboard5 containner_Productos_con_bajo_Stock">
		<label class="Title_Productos_con_bajo_Stock">Productos con bajo Stock</label>
		<div>
			
		</div>
	</section>
	<section class="section_dasboard6 containner_Acciones_Rapidas">
		<label class="title_Acciones_Rapidas">Acciones Rapidas</label>
		<div class="sub_containner_Acciones_Rapidas">
			<button class="btn_Acciones_Rapidas" style="color:white; background:red;">+ Nuevo Producto</button> 
			<button class="btn_Acciones_Rapidas" style="color:white; background:blue;">+ Nuevo Movimento</button> 
			<button class="btn_Acciones_Rapidas" style="color:white; background:green;">Ajuste de Precio</button> 
			<button class="btn_Acciones_Rapidas" style="color:white; background:purple;">Generar Reporte</button>
		</div>
	</section>
	<section class="section_dasboard7 containner_Movimientos_Recientes">
		<label class="title_Movimientos_Recientes">Movimientos Recientes</label>
		<div>
			
		</div>
</section>
</section>`;

function Dashboard(id){
    

    document.getElementById(id).innerHTML=Html_Dashboard;

}