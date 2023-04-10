const { sendQueryDataBase } = require("../config/model_database");

exports.login = (req, res, next) => {

   const {
      password
   } = req.body;

   const query = `SELECT id_odontologos AS id, cedulas_odontologos AS cedulas, nombres_odontologos AS nombres, apellidos_odontologos AS apellidos, telefonos_odontologos AS telefonos FROM odontologos WHERE cedulas_odontologos = ? LIMIT 1;`
   const data_query = [password];
   sendQueryDataBase(query, data_query)
      .then((response) => {
         req.body.data = response
         next();
      })
      .catch((error) => {
         throw error;
      })
}

exports.get_imagenes_productos = async (req, res, next) => {

   const {
      prescripcion
   } = req.body;

   let ids = ''

   for (let i = 0; i < prescripcion.productos.length; i++) {
      ids += '?,'
   }

   const query = `SELECT nombres_productos AS nombres, usos_productos AS usos, imagenes_productos AS imagenes FROM productos WHERE id_productos IN (${ids.slice(0, -1)});`
   const data_query = prescripcion.productos;

   sendQueryDataBase(query, data_query)
      .then((res) => {
         req.body.prescripcion.productos = res;
         next();
      })
      .catch((err) => {
         next(err);
      })
}

exports.get_lista_productos = async (req, res, next) => {

   const query = `SELECT id_productos, nombres_productos, imagenes_productos, categoria_productos FROM productos;`
   sendQueryDataBase(query)
      .then((response) => {
         res.send(response);
      })
      .catch((err) => {
         next(err);
      })
}

exports.get_prescripcion = async (req, res, next) => {

   const id = parseInt(Buffer.from(req.params.id_pres, 'base64').toString('ascii'));

   const query_prescripcion = `SELECT id_odontologos, cedulas, nombres, apellidos, recomendaciones, fecha_registro FROM prescripciones WHERE id_prescripciones = ?;`;
   const query_odontologo = `SELECT cedulas_odontologos AS cedulas, nombres_odontologos AS nombres, apellidos_odontologos AS apellidos, telefonos_odontologos AS telefonos FROM odontologos WHERE id_odontologos = ?;`;
   const query_productos = `SELECT p.nombres_productos AS nombres FROM registro_productos rp JOIN productos p ON rp.id_productos = p.id_productos WHERE rp.id_prescripciones = ?;`;

   const prescripcion = await sendQueryDataBase(query_prescripcion, id)
      .then((response) => {
         return response[0];
      })
      .catch((err) => {
         next(err);
      })

   const odontologo = await sendQueryDataBase(query_odontologo, prescripcion.id_odontologos)
      .then((response) => {
         return response[0];
      })
      .catch((err) => {
         next(err);
      })

   const productos = await sendQueryDataBase(query_productos, id)
      .then((response) => {
         return response;
      })
      .catch((err) => {
         next(err);
      })

   req.body.data = {
      id,
      prescripcion,
      odontologo,
      productos
   }

   next();
}

exports.post_data_prescripcion = async (req, res, next) => {

   const { odontologo } = req.authData;

   const {
      paciente,
      prescripcion
   } = req.body;

   const query = `INSERT INTO prescripciones (id_odontologos, cedulas, nombres, apellidos, recomendaciones) VALUES (?, ?, ?, ?, ?);`

   const insert_data_prescripcion = await sendQueryDataBase(query, [odontologo.id, paciente.cedula, paciente.nombre, paciente.apellido, prescripcion.recomendaciones])
      .then((res) => { return res })
      .catch((err) => { next(err) })

   for (let i = 0; i < prescripcion.productos.length; i++) {
      const query = `INSERT INTO registro_productos (id_prescripciones, id_productos) VALUES (?, ?);`;
      await sendQueryDataBase(query, [insert_data_prescripcion.insertId, prescripcion.productos[i]])
         .catch((err) => { next(err) })
   }

   req.body.prescripcion.id = insert_data_prescripcion.insertId;

   next();
}

exports.post_imagen_firma_sello = async (req, res, next) => {

   const { id } = req.query;

   for (const property in imagenes) {
      const id_tipo_imagenes = property === 'firma' ? 1 : 2;
      const query = `INSERT INTO imagenes_odontologos (id_odontologos, id_tipo_imagenes, nombre_imagen) VALUES (?, ?, ?)`;
      const data_query = [odontologo.id, id_tipo_imagenes, imagenes[property][0].filename];

      await sendQueryDataBase(query, data_query)
         .catch((err) => {
            next(err)
         })
   }

   res.send('Los archivos se han añadido correctamente');

}