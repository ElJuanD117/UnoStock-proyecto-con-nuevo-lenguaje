

let Html_Producto=`
<section class="productos" id="productosdata">
	<div class="container-search-productos">
		<input  id="inputSearch" class="input-text-producto" placeholder="Codigo o Nombre de Producto" type="search">
		<button class="btn-product-action Buscar icon-search" id="btn-buscar"></button>
		<button class="btn-product-action Ingreso agregar icon-arrow-down" id="btn-Ingreso">Ingreso</button>		
		<button class="btn-product-action Retiro icon-cart" id="btn-Retiro">Retiro</button>
		<button class="btn-product-action Categoria" id="btn-Categoria">Categoria</button>
	</div>
	<div class="container-select-categoria">
		<label class="label-categoria-productos" id="categoria">Categoria</label>
		<div class="sub-container-select-categoria" id="containner_categoria_lista">
		</div>
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
	/*----------------------*/

    input_search.addEventListener("search", function(e) { 
                      
            if(input_search.value==""){

                api.send("solicitud-data-productos")

            }else{

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

/*------------------------------------------------*/
let Valor_money_cambio;

async function obtenerCambioUSD() {
  try {
    const respuesta = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    const datos = await respuesta.json();

        return datos.promedio;

  } catch (error) {
    console.error("Error al obtener el cambio:", error);
    return null;
  }
}

// Uso de la función
obtenerCambioUSD().then(valor => {
    
    Valor_money_cambio=valor

});

/*------------------------------------------------*/


api.receive("categoria-list-data-product",(event,data_categoria)=>{

	//console.log("categoria-list-data-product",data_categoria)


	    let containner_categoria = document.getElementById("containner_categoria_lista");

        containner_categoria.innerHTML+="";

        while(containner_categoria.hasChildNodes()){

            containner_categoria.removeChild(containner_categoria.firstChild);
                                        
        }

        if(data_categoria.length>0){

				data_categoria.forEach((categoria, index)=>{

					containner_categoria.innerHTML+=`<div class="item-categoria" id="categoria" onclick="Busqueda_Categoria_producto('${categoria.nombre}')">
					<span style="color:yellow" class="icon-folder-open"></span>
					${categoria.nombre}
					</div>`;

				})

        }
})

api.receive("productos-data",(event, data_producto)=>{

	console.log("productos-data", data_producto)

    let containner_product = document.getElementById("list_product");

    containner_product.innerHTML+="";

    while(containner_product.hasChildNodes()){

        containner_product.removeChild(containner_product.firstChild);
                                    
    }
    /*-------------------------------------*/
		if(data_producto.length>0){

			data_producto.forEach((producto, index)=>{

				//console.log('productos-data',producto)

containner_product.innerHTML+=`<article class="articlulo-product">
			<label class="productos-cod">
				<h1>Cod:</h1>
				<span>${producto.cod}</span>
			</label>
			<div class="container-imagen-product">
				<img class="data-image-product" id="data-producto-image" alt="imagen-data" src="${producto.image}">
			</div>
			<div class="container-data-producto">
				<h3 id="Nombre_producto_data">Nombre: <span id="data-npmbre">${producto.nombre}</span></h3>
				<label id="cant_producto_data">Cant:<span>${producto.cant}</span></label>
				<label id="categoria_producto_data">Categoria: <span>${producto.categoria}</span></label>
				<label id="precio_producto_data">
					<span id="precio">Precio: <span>${producto.precio*Valor_money_cambio}</span>
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


		}else{


				containner_product.innerHTML=`<h1>No Datos de Producto</h1>`;

					Notificacion("No datos localizados de productos")

		}
	/*-------------------------------------*/

})


/*-----------------FUNCIONES CATEGORIA------------------------------*/

function Busqueda_Categoria_producto(dato){

  console.log('Buscar-categoria-producto',dato)
  api.send('Buscar-categoria-producto',dato)


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


function Notificacion(NOTIFICATION_BODY){

	const NOTIFICATION_TITLE = 'Notificación'
	const CLICK_MESSAGE = 'clicked'

	new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
	() => console.log(CLICK_MESSAGE)
}


