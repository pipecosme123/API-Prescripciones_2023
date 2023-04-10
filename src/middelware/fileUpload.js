const isImage = require("is-image");
const multer = require("multer")

const diskstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.fieldname === 'sello') {
      folder = 'src/uploads/sellos';
    } else if (file.fieldname === 'firma') {
      folder = 'src/uploads/firmas';
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {

  const extensionesPermitidas = ['.jpg', '.jpeg', '.png'];
  const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();

  if (extensionesPermitidas.includes(extension)) {
    if (isImage(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('El archivo enviado no es una imagen'), false);
    }
  } else {
    cb(new Error('Tipo de archivo no permitido. Unicamente se aceptan archivos de tipo .jpg, .jpeg y .png'), false);
  }

}

const fileUpload = multer({
  storage: diskstorage,
  fileFilter: fileFilter
})

module.exports = fileUpload.fields([
  { name: 'firma', maxCount: 1 },
  { name: 'sello', maxCount: 1 }
])