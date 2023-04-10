exports.buildJson = (req, res, next) => {

   const {
      id,
      prescripcion,
      odontologo,
      productos
   } = req.body.data;

   const lista_productos = productos.map((objeto) => objeto.nombres);
   const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

   res.send({
      paciente: {
         cedula: prescripcion.cedulas,
         nombres: prescripcion.nombres.toUpperCase(),
         apellidos: prescripcion.apellidos.toUpperCase(),
      },
      prescripcion: {
         id,
         productos: lista_productos,
         recomendaciones: prescripcion.recomendaciones
      },
      odontologo:
      {
         cedula: odontologo.cedulas,
         nombre: odontologo.nombres.toUpperCase(),
         apellido: odontologo.apellidos.toUpperCase(),
         telefono: odontologo.telefonos
      },
      fecha_registro: new Date(prescripcion.fecha_registro).toLocaleString('es-CO', opciones)
   })
}