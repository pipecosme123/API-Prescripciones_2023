const { crearToken } = require("./token");

exports.validateDataUsers = (req, res, next) => {

   const { data } = req.body;

   if (data.length === 0) {

      res.status(403).send("El número de cedula es incorrecto");

   } else {
      res.status(200).json({
         token: crearToken(data[0]),
         data: data[0]
      });
   }
}