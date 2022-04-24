const fs = require('fs');

class Productos {

  constructor(){
    this.id = 1;
  }

  async guardar(obj){
    const saveObj = {
      ...obj,
    };

    const prods = await readFS();
    const parseProd = JSON.parse(prods);

    const date = new Date().toLocaleString();

    if(prods && parseProd.length != 0){

      /*Agregar Id y Date*/
      saveObj.date = date
      saveObj.id = this.id += 1;

      /*Guardar*/
      await writeFS(JSON.stringify([...parseProd, saveObj], null, 2));

    } else {

      /*Agregar Id y Date*/
      saveObj.date = date
      saveObj.id = this.id;

      /*Guardar*/
      const arr = new Array(saveObj);
      await writeFS(JSON.stringify(arr, null, 2));

    }

    return {id: saveObj.id, msg: 'Producto guardado'};

  }

  async listar(id){
      const prod = await readFS();
      const parseProd = JSON.parse(prod);

      if(prod){
        const isProd = parseProd.some(prod => prod.id === id);

        if(isProd){
          const prodId = parseProd.filter(prod => prod.id === id);
         return prodId;
        } else {
          return {msg: `No se encontró un producto con el id: ${id}`};
        }

      }

      return {msg: 'El archivo no se encontró. Por favor inicie uno utilizando el método "save"'};
  }

  async listarAll(){
      const prods = await readFS();
      if(prods){
        const parseProds = JSON.parse(prods);
        return parseProds;
      }

      return false;
    }

    async actualizar(prod, id){
      const products = await readFS();
      const parseProd = JSON.parse(products);
      const date = new Date().toLocaleString();

      if(products){
        const updateProd = parseProd.filter(prod => prod.id !== id);
        prod.id = id;
        prod.date = date;
        //await writeFS(JSON.stringify([...updateProd, prod], null, 2));
        return prod;
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
    const data =  await fs.promises.readFile('__dirname' + '../../dbProductos.json', 'utf-8');
    return data;
  } catch (err){
    return false;
  }
}

async function writeFS(data){
  try {
    await fs.promises.writeFile('__dirname' + '../../dbProductos.json', data);
  } catch (err){
    throw new Error (err);
  }
}

module.exports = Productos;