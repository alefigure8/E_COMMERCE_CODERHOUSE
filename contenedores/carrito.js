const fs = require('fs');

class Carrito {
  constructor(){
    this.id = 1;
  }

  async guardar(obj){
    const saveObj = {
      ...obj,
    };

    const carrito = await readFS();
    const parseCarrito = JSON.parse(carrito);

    console.log(parseCarrito);

    const date = new Date().toLocaleString();

    if(carrito && parseCarrito.length !== 0){

      /*Agregar Id y Date*/
      saveObj.date = date
      saveObj.id = this.id+=1;

      /*Guardar*/
      await writeFS(JSON.stringify([...parseCarrito, saveObj], null, 2));

    } else {

      /*Agregar Id y Date*/
      saveObj.date = date
      saveObj.id = this.id;

      /*Guardar*/
      const arr = new Array(saveObj);
      await writeFS(JSON.stringify(arr, null, 2));

    }

    return saveObj.id;

  }

  async listarCarrito(id){
      const carritos = await readFS();
      if(carritos){
        const parseCarritos = JSON.parse(carritos);
        const carrito = parseCarritos.filter(products => products.id == id);
        return carrito[0].productos;
      }

      return false;
    }

    async eliminarUnProducto(id, id_prod){
      const carritos = await readFS();
      if(carritos){
        /*Actualizar carrito*/
        const parseCarritos = JSON.parse(carritos);
        const carrito = parseCarritos.filter(products => products.id == id)[0];
        const borrarProdcutos = carrito.productos.filter(prods => prods.id != id_prod);
        carrito.productos = borrarProdcutos;

        /*Modificar carrito*/
        const listadoActualizado = parseCarritos.filter(products => products.id != id);

        /*Guardar nuevo listado*/
        await writeFS(JSON.stringify([...listadoActualizado, carrito], null, 2));

      }

      return false;
    }

    async agregarUnProducto(prod, id){
      const carrito = await readFS();
      const date = new Date().toLocaleString();

      if(carrito){
        /*Actualizar carrito*/
        const parseCarritos = JSON.parse(carrito);
        const cambiarCarrito = parseCarritos.filter(products => products.id == id)[0];
        prod.date = date;
        cambiarCarrito.productos.push(prod)

         /*Modificar carrito*/
         const listadoActualizado = parseCarritos.filter(products => products.id != id);

         /*Guardar nuevo listado*/
         await writeFS(JSON.stringify([...listadoActualizado, cambiarCarrito], null, 2));
      }

      return false;
    }

  async borrar(id){
      const prod = await readFS();
      const parseProd = JSON.parse(prod);

      if(prod){
        const isProd = parseProd.some(prod => prod.id === id);

        if(isProd){
          const deleteProd = parseProd.filter(prod => prod.id !== id);
          await writeFS(JSON.stringify(deleteProd, null, 2));
          return {msg: `Producto con id: ${id} fue eliminado`};
        } else {
          return {msg: `No se encontró un producto con el id: ${id}`};
        }

      }

    return {msg: 'El archivo no se encontró. Por favor inicie uno utilizando el método "save"'};
  }

}

/* FUNCIONES FS*/

async function readFS(){
  try {
    const data =  await fs.promises.readFile('__dirname' + '../../dbCarrito.json', 'utf-8');
    return data;
  } catch (err){
    return false;
  }
}

async function writeFS(data){
  try {
    await fs.promises.writeFile('__dirname' + '../../dbCarrito.json', data);
  } catch (err){
    throw new Error (err);
  }
}

module.exports = Carrito;