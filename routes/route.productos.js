const {Router} = require('express');
const router = Router();
const Productos = require('../contenedores/productos');
const soloAdmin = require('../middleware/soloAdmin')

const productos = new Productos();

router.get('/', async (req, res) => {
  const data = await productos.listarAll();
  console.log(productos.id);
  res.json(data);
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const data = await productos.listar(id);
  res.json(data);
})

router.post('/', soloAdmin, async (req, res) => {
  const data = req.body;
  const dataSave = await productos.guardar(data);
  res.json(dataSave);
 // res.redirect('/')
})

router.put('/:id',soloAdmin, async (req, res) => {
  const data = req.body;
  const id = Number(req.params.id);
  const dataSave = await productos.actualizar(data, id);
  res.json(dataSave);
})

router.delete('/:id',soloAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const dataDelete = await productos.borrar(id);
  res.json(dataDelete);
})

module.exports = router;