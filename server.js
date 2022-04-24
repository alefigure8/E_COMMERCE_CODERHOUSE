const express = require('express');
const productos = require('./routes/route.productos');
const carrito = require('./routes/route.carrito');
const handleError = require('./middleware/handleError');
const path = require('path');
const public = path.join(__dirname, 'src/public');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productos);
app.use('/api/carrito', carrito);
app.use('/', express.static(public));

app.use(handleError);

module.exports = app;