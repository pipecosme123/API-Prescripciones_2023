exports.varificarRol = (roles) => (req, res, next) => {

   const { rol } = req.body;
   
   if ([].concat(roles).includes(rol)) {
      next();
   }else{
      res.status(409).send({
         error: "No tienen permisos"
      })
   }
}