function soloAdmins(req, res, next){

  const isAdmin = req.headers.isadmin;

  if(isAdmin){
    next()
  } else {
    res.json(errorNoAdmin())
  }
}

function errorNoAdmin(ruta, metodo){
  const error = {
    error: -1
  }

  if(ruta && metodo){
    error.descripcion = `ruta ${ruta} metodo ${metodo} no autorizados`;
  } else {
    error.descripcion = 'no autorizado';
  }

  return error;
}

module.exports = soloAdmins;