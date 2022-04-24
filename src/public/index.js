const cardProducts = document.getElementById('productos');
const isAdmin = document.getElementById('isAdmin');
const formularioProducto = document.getElementById('formularioProducto');
let nombre = document.getElementById('nombre');
let descripcion = document.getElementById('descripcion');
let codigo = document.getElementById('codigo');
let precio = document.getElementById('precio');
let stock = document.getElementById('stock');
let foto = document.getElementById('foto');
const enviar = document.getElementById('enviar');
const btnForm = document.getElementById('btnForm');
const dropdownBtn = document.getElementById('navbarDropdownMenuLink');
const dropdown = document.getElementById('dropdown');


let obj = {};
let changeAdmin = false;

formularioProducto.classList.remove('block')
formularioProducto.classList.add('hide')

formularioProducto.addEventListener('change', ()=>{
  obj = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    codigo: codigo.value,
    precio: precio.value,
    stock: stock.value,
    foto: foto.value
  };

})

/*Cambiar permisos*/
isAdmin.addEventListener('click', (e)=>{
  e.preventDefault()
  const admin = e.target.textContent;
  if(admin != 'Admin'){
    e.target.innerHTML = 'Admin';
    listaProductos()
    changeAdmin = true;
    formularioProducto.classList.remove('hide')
    formularioProducto.classList.add('block')
  } else {
    e.target.textContent = 'No es Admin';
    listaProductos()
    changeAdmin = false;
    formularioProducto.classList.remove('block')
    formularioProducto.classList.add('hide')

  }
})

/*desplegable menu*/
dropdownBtn.addEventListener('click', () => {
  dropdown.classList.toggle('block')
})

async function listaProductos () {
  const obtenerProductos = await fetch('/api/productos',  {
    headers:{
    'Content-Type': 'application/json'
  }
})
  const resolve = await obtenerProductos.json()
  createCards(resolve)
}

listaProductos()

function createCards(products){
  const cards = products.map(product => {
   if(changeAdmin){
    return `
    <div class="card p-3 m-3" style="max-width: 18rem;">
    <img class="card-img-top" src="${product.foto}" alt="Card image cap">
    <h2 class="card-title text-center">${product.nombre}</h2>
      <div class="card-body">
        <div class="card-body">
          <p class="card-text"> Descripcion: ${product.descripcion}</p>
          <p class="card-text">Precio: $${product.precio}</p>
          <p class="card-text">Código: ${product.codigo}</p>
          <p class="card-text">Stock: ${product.stock}</p>
          <button class="btn btn-primary btn-sm" id="actualizar" onclick="updateButton(${product.id})">Actualizar</button>
          <button class="btn btn-primary btn-sm" id="borrar" onclick="deleteButton(${product.id})">Borrar</button>
        </div>
      </div>
    </div>
    `
   } else {
    return `
    <div class="card p-3 m-3" style="max-width: 18rem;">
    <img class="card-img-top" src="${product.foto}" alt="Card image cap">
    <h2 class="card-title text-center">${product.nombre}</h2>
      <div class="card-body">
        <div class="card-body">
          <p class="card-text"> Descripcion: ${product.descripcion}</p>
          <p class="card-text">Precio: $${product.precio}</p>
          <p class="card-text">Código: ${product.codigo}</p>
          <p class="card-text">Stock: ${product.stock}</p>
          <div class="col-md-12 text-center">
           <button class="btn btn-primary btn-sm mt-4" id="carrito" onclick="carritoButton(${product.id})">carrito</button>
          </div>
        </div>
      </div>
    </div>
    `
   }
  });
  cardProducts.innerHTML = cards.join('')
}

/*Enviar un producto nuevo al listado*/
enviar.addEventListener('click', async (e)=>{
  e.preventDefault()
  await fetch(`/api/productos`,  {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'isAdmin': changeAdmin
    },
    body: JSON.stringify(obj)
  })

  listaProductos()

})

/*Actualizar un producto nuevo al listado*/
async function updateButton(idProd){
  let id = idProd;

  enviar.classList.add('hide')

  /* fetch */
  const obtenerProductos = await fetch('/api/productos');
  const resolve = await obtenerProductos.json();

  /*Buscar producto en listado*/
  const product = resolve.filter(product => product.id == id)[0];

  /*Colocar en formulario*/
  nombre.value = product.nombre;
  descripcion.value = product.descripcion;
  codigo.value = product.codigo;
  precio.value = product.precio;
  stock.value = product.codigo;
  foto.value = product.foto;

  /*Agregar boton cancelar*/
  const btnUpdate = document.createElement('input')
  btnUpdate.classList.add('btn', 'btn-primary', 'mt-4', 'm-4')
  btnUpdate.setAttribute('value', 'Actualizar')
  btnUpdate.setAttribute('id', 'actualizar')
  btnUpdate.setAttribute('onclick', `enviarActualizacion(${id})`)
  btnForm.appendChild(btnUpdate);

  /*Agregar boton cancelar*/
  const btnCancelar = document.createElement('input')
  btnCancelar.classList.add('btn', 'btn-primary', 'mt-4', 'm-4')
  btnCancelar.setAttribute('value', 'Cancelar')
  btnCancelar.setAttribute('id', 'cancelar')
  btnCancelar.setAttribute('onclick', 'cancelarActualizacion()')
  btnForm.appendChild(btnCancelar);

}

/*Actualizar*/

async function enviarActualizacion(idprod){
  const btnActualizar = document.getElementById('actualizar')
  const btnCancelar = document.getElementById('cancelar')
  const id = idprod;

  await fetch(`/api/productos/${id}`,  {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json',
      'isAdmin': changeAdmin
    },
    body: JSON.stringify(obj)
  })

  btnCancelar.remove()
  enviar.classList.remove('hide')
  btnActualizar.remove()

  /*Colocar en formulario*/
  nombre.value ='';
  descripcion.value = '';
  codigo.value = '';
  precio.value = '';
  stock.value = '';
  foto.value = '';

  listaProductos()
}

/*Cancelar Actualizacion*/
function cancelarActualizacion(){
  const btnCancelar = document.getElementById('cancelar')
  const btnActualizar = document.getElementById('actualizar')

  btnCancelar.remove()
  enviar.classList.remove('hide')
  btnActualizar.remove()

  /*Colocar en formulario*/
  nombre.value ='';
  descripcion.value = '';
  codigo.value = '';
  precio.value = '';
  stock.value = '';
  foto.value = '';
}

/* Borrar un producto del listado*/
async function deleteButton(idProd){
  const id = idProd;
  const seguridad = confirm('Está a punto de borrar un producto. ¿Está seguro?')
  if(seguridad){
    await fetch(`/api/productos/${id}`,  {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'isAdmin': changeAdmin
      }
    })

    listaProductos()
  }
}

/*Agregar un producto al carrito*/
async function carritoButton(id){
  const obtenerProductosCarrito = await fetch('/api/productos');
  const resolveProductosCarrito = await obtenerProductosCarrito.json();
  const producto = resolveProductosCarrito.filter(product => product.id == id);

  await fetch(`/api/carrito/1/productos`,  {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'isAdmin': changeAdmin
    },
    body: JSON.stringify(producto[0])
  })

  const obtenerProductos = await fetch('/api/carrito/1/productos');
  const resolve = await obtenerProductos.json();
  const carrtioLista = resolve.map(product => {
    return `
    <div class="dropdown-item d-flex flex-sm-row">
      <p class="font-weight-bold mr-3">${product.nombre}</p>
      <p>$${product.precio}</p>
    </div>
    `
  })

  dropdown.innerHTML = carrtioLista
}
