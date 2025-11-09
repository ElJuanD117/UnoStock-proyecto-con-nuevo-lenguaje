

let Html_Producto=`
<section class="productos" id="productosdata">
	<div class="container-search">
		<input  id="inputSearch" placeholder="Codigo o Nombre de Producto" type="search">
		<button class="btn-product-action Buscar icon-search" id="btn-buscar"></button>
		<button class="btn-product-action Ingreso agregar icon-arrow-down" id="btn-Ingreso">Ingreso</button>		
		<button class="btn-product-action Retiro icon-cart" id="btn-Retiro">Retiro</button>
	</div>
	<div class="container-select-categoria" id="containner_categoria_lista">
		<!--------	
		<label class="item-categoria" id="categoria">item<span>x</span></label>
		---------->
	</div>
	<div class="container-list-product" id="list_product">
		<!-----------LISTA DE PRODUCTO-------------->
	</div>
</section>`;


function Productos(id){

	document.getElementById(id).innerHTML=Html_Producto;
		/*
	for(let i=0; i<20;i++){

		document.getElementById("list_product").innerHTML+=`<article class="articlulo-product">
			<div class="container-imagen-product">
				<img class="data-image-product" id="data-producto-image" alt="imagen-data" src="C:/Users/Duno%20Castellano/Desktop/Proyectos/UnoStock-proyecto-con-nuevo-lenguaje/app/Productos/Copilot_20251102_220924.png">
			</div>
			<div class="container-data-producto">
				<h3 id="Nombre_producto_data">Nombre <span id="data-npmbre">Chuleta</span></h3>
				<label id="cant_producto_data">Cant.<span>80</span></label>
				<label id="categoria_producto_data">Categoria <span>Carne</span></label>
				<label id="precio_producto_data">
					<span id="precio">Precio <span>0.00</span>
					<span id="simbolo">Bs</span>
				</label>
			</div>
			<div class="container-btn-action-producto">
					<button class="btn-action-producto actualizar icon-spinner9" onclick="Actualizar_producto(${i})">actualizar</button>
					<button class="btn-action-producto informacion icon-notification" onclick="Info_producto(${i})">informacion</button>
					<button class="btn-action-producto borrar icon-bin2" onclick="Borrar_producto(${i})">borrar</button>
				</div>
		</article>`;
	}
*/
	for(let a=0; a<10; a++){

		document.getElementById("containner_categoria_lista").innerHTML+=`<label class="item-categoria" id="categoria" onclick="Busqueda_Categoria_producto(${a})">item</label>`;
		
	}


	/*----------------------*/
	let input_search = document.getElementById("inputSearch")
	input_search.focus();
	let btn_buscar = document.getElementById("btn-buscar")
	let btn_retiro = document.getElementById("btn-Ingreso")
	let btn_Retiro = document.getElementById("btn-Retiro")
	/*------------*/

                input_search.addEventListener("search", function(e) { 

                    console.log("Funcion de text")
                                  
                        if(input_search.value==""){
                                    
                            console.log("input limpio")
                            api.send("solicitud-data-productos")

                        }else{

                            console.log("inout lleno",input_search.value)
                            api.send('Buscar-input-text-producto',input_search.value)
           
                        }                                       
                })

                btn_buscar.addEventListener('click',function(evt){

                            console.log("btn buscar Producto",input_search.value)
                            api.send('Buscar-input-text-producto',input_search.value)


                })
                btn_retiro.addEventListener('click',function(evt){

                            console.log("btn buscar Producto")
                            api.send("open-registro-producto")


                }) 
                btn_Retiro.addEventListener('click',function(evt){

                            console.log("btn buscar Producto")
                            api.send("open-retiro-producto")


                })

                api.send("solicitud-data-productos")
}

api.receive("productos-data",(event, data)=>{

	console.log('productos-data',data)

	    let containner_product = document.getElementById("list_product");

        containner_product.innerHTML+="";

        while(containner_product.hasChildNodes()){

            containner_product.removeChild(containner_product.firstChild);
                                        
        }

	data.forEach((producto, index)=>{

		console.log('productos-data',producto)

		containner_product.innerHTML+=`<article class="articlulo-product">
					<div class="container-imagen-product">
						<img class="data-image-product" id="data-producto-image" alt="imagen-data" src="${producto.image}">
					</div>
					<div class="container-data-producto">
						<h3 id="Nombre_producto_data">Nombre <span id="data-npmbre">${producto.nombre}</span></h3>
						<label id="cant_producto_data">Cant.<span>${producto.cant}</span></label>
						<label id="categoria_producto_data">Categoria <span>${producto.categoria}</span></label>
						<label id="precio_producto_data">
							<span id="precio">Precio <span>${producto.precio}</span>
							<span id="simbolo">Bs</span>
						</label>
					</div>
					<div class="container-btn-action-producto">
							<button class="btn-action-producto actualizar icon-spinner9" onclick="Actualizar_producto('${producto.cod}')">actualizar</button>
							<button class="btn-action-producto informacion icon-notification" onclick="Info_producto('${producto.cod}')">informacion</button>
							<button class="btn-action-producto borrar icon-bin2" onclick="Borrar_producto('${producto.cod}')">borrar</button>
						</div>
				</article>`;


	})



})


/*-----------------FUNCIONES CATEGORIA------------------------------*/

function Busqueda_Categoria_producto(id){

  console.log('Buscar-categoria-producto',id)
  api.send('Buscar-categoria-producto',id)


}

/*-----------------FUNCIONES BTN PRODUCTO------------------------------*/

function Info_producto(id){
    
    console.log("Info_product",id)

  api.send('open-Info-producto',id)
                                                     
}
function Actualizar_producto(id){
    
    console.log("Actualizar_product",id)

     api.send('open-Actualizar-producto',id)
                                                     
}
function Borrar_producto(id){
    
    console.log("Borrar_product",id)

     api.send('open-Borrar-producto',id)
                                                     
}
