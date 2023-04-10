const fs = require('fs');

exports.downloadFiles = (req, res, next) => {
   res.download(req.body.filename, (err) => {
      if (err) throw err;
      next();
   });
}

exports.deleteFiles = (req, res, next) => {
   try {
      fs.unlinkSync(req.body.filename)
      console.log('File removed')
   } catch (err) {
      throw new Error(`No se pudo eliminar el archivo que esta en la ruta: '${req.body.filename}'`)
   }
}