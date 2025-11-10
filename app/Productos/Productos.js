

let Html_Producto=`
<section class="productos" id="productosdata">
	<div class="container-search">
		<input  id="inputSearch" class="input-text" placeholder="Codigo o Nombre de Producto" type="search">
		<button class="btn-product-action Buscar icon-search" id="btn-buscar"></button>
		<button class="btn-product-action Ingreso agregar icon-arrow-down" id="btn-Ingreso">Ingreso</button>		
		<button class="btn-product-action Retiro icon-cart" id="btn-Retiro">Retiro</button>
		<button class="btn-product-action Categoria" id="btn-Categoria">Categoria</button>
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

	/*----------------------*/
	let input_search = document.getElementById("inputSearch")
	input_search.focus();
	let btn_buscar = document.getElementById("btn-buscar")
	let btn_Ingreso = document.getElementById("btn-Ingreso")
	let btn_Retiro = document.getElementById("btn-Retiro")
	let btn_Categoria = document.getElementById("btn-Categoria")
	/*------------*/

                input_search.addEventListener("search", function(e) { 

                    //console.log("Funcion de text")
                                  
                        if(input_search.value==""){
                                    
                            //console.log("input limpio")
                            api.send("solicitud-data-productos")

                        }else{

                            //console.log("inout lleno",input_search.value)
                            api.send('Buscar-input-text-producto',input_search.value)
           
                        }                                       
                })

                btn_buscar.addEventListener('click',function(evt){

                            //console.log("btn buscar Producto",input_search.value)
                            api.send('Buscar-input-text-producto',input_search.value)


                })
                btn_Ingreso.addEventListener('click',function(evt){

                            //console.log("btn buscar Producto")
                            api.send("open-registro-producto")


                }) 
                btn_Retiro.addEventListener('click',function(evt){

                            //console.log("btn buscar Producto")
                            api.send("open-retiro-producto")


                })
                btn_Categoria.addEventListener('click',function(evt){

                            //console.log("btn buscar Producto")
                            api.send("open-add-category")


                })

                api.send("solicitud-data-productos")
}

api.receive("categoria-list-data-product",(event, data)=>{

	console.log(data)

	    let containner_categoria = document.getElementById("containner_categoria_lista");

        containner_categoria.innerHTML+="";

        while(containner_categoria.hasChildNodes()){

            containner_categoria.removeChild(containner_categoria.firstChild);
                                        
        }

	data.forEach((categoria, index)=>{

			containner_categoria.innerHTML+=`<div class="item-categoria" id="categoria" onclick="Busqueda_Categoria_producto(${categoria.key})">
					<span style="color:yellow" class="icon-folder-open"></span>
					${categoria.nombre}
				</div>`;


	})




})

api.receive("productos-data",(event, data)=>{

	//console.log('productos-data',data)

	    let containner_product = document.getElementById("list_product");

        containner_product.innerHTML+="";

        while(containner_product.hasChildNodes()){

            containner_product.removeChild(containner_product.firstChild);
                                        
        }

	data.forEach((producto, index)=>{

		//console.log('productos-data',producto)

		containner_product.innerHTML+=`<article class="articlulo-product">
					<div class="container-imagen-product">
						<img class="data-image-product" id="data-producto-image" alt="imagen-data" src="${producto.image}">
					</div>
					<div class="container-data-producto">
						<h3 id="Nombre_producto_data">Nombre: <span id="data-npmbre">${producto.nombre}</span></h3>
						<label id="cant_producto_data">Cant:<span>${producto.cant}</span></label>
						<label id="categoria_producto_data">Categoria: <span>${producto.categoria}</span></label>
						<label id="precio_producto_data">
							<span id="precio">Precio: <span>${producto.precio}</span>
							<span id="simbolo">Bs</span>
						</label>
					</div>
					<div class="container-btn-action-producto">
							<button class="btn-action-producto actualizar " onclick="Actualizar_producto('${producto.cod}')"><span class="icon-spinner9"></span>actualizar</button>
							<button class="btn-action-producto informacion " onclick="Info_producto('${producto.cod}')"><span class="icon-notification"></span>informacion</button>
							<button class="btn-action-producto borrar " onclick="Borrar_producto('${producto.cod}')"><span class="icon-bin2"></span>borrar</button>
						</div>
				</article>`;


	})



})


/*-----------------FUNCIONES CATEGORIA------------------------------*/

function Busqueda_Categoria_producto(id){

 // console.log('Buscar-categoria-producto',id)
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
