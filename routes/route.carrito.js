const {Router} = require('express');
const router = Router();
const Carrito = require('../contenedores/carrito')
const carrito = new Carrito()

/*Crear carrito*/
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const dataSave = await carrito.guardar(data);
    res.status(200).json(dataSave);
  } catch (error) {
    next();
  }
})

/*Borrar carrito*/
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dataDelete = await carrito.borrar(id);
    res.status(200).json(dataDelete);
  } catch (error) {
    next();
  }
})

/*Borrar un producto*/
router.delete('/:id/productos/:id_prod', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const id_prod = Number(req.params.id_prod);
    const dataDelete = await carrito.eliminarUnProducto(id, id_prod);
  res.status(200).json(dataDelete);
  } catch (error) {
    next();
  }
})

/*Listar productos de un carrito*/
router.get('/:id/productos', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await carrito.listarCarrito(id);
    res.status(200).json(data);
  } catch (error) {
    next()
  }
})

/*Agregar un producto al carrito*/
router.post('/:id/productos', async (req, res, next) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const dataSave = await carrito.agregarUnProducto(data, id);
    res.status(200).json(dataSave);
  } catch (error) {
    next();
    
  }
})

module.exports = router;