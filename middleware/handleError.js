function handleError(req, res){
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const method = req.method;
  res.status(500).send({error: -1, description: `ruta ${url} y ${method} no implementada`})
}

module.exports = handleError;