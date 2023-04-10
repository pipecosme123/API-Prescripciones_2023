const fs = require('fs');
const filePDF = require('html-pdf');
const qrcode = require("qrcode");
const path = require('path');
const { buildHTML } = require('../helpers/buildHTML');

const getRandomArbitrary = (min, max) => {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min) + min);
}

const getFecha = () => {
   const fechaActual = new Date();
   const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
   return (`${fechaActual.getDate()} / ${meses[fechaActual.getMonth()]} / ${fechaActual.getFullYear()}`);
}

const createQRCode = async (url) => {

   let objOptions = {
      margin: 0
   }

   const QR = await qrcode.toDataURL(url, objOptions);
   return (QR);
}

exports.createPDF = async (req, res, next) => {

   const {
      paciente,
      prescripcion
   } = req.body;

   const { odontologo } = req.authData;

   const serial = new Date().getTime();
   let fileName = `${serial}-businesscard.pdf`;

   let html = fs.readFileSync('./src/view/templete.html', 'utf8');
   const domain = req.headers.host;
   const encoded = Buffer.from(prescripcion.id.toString()).toString('base64');

   let info = encodeURI(`http://${domain}/prescripcion/${encoded}`);

   let qr_code = await createQRCode(info);

   let data = {
      '{{FECHA_ACTUAL}}': getFecha(),
      '{{NOMBRE_PACIENTE}}': paciente.nombre,
      '{{APELLIDO_PACIENTE}}': paciente.apellido,
      '{{CEDULA_PACIENTE}}': new Intl.NumberFormat('es-MX').format(paciente.cedula),
      '{{CEDULA_DOCTOR}}': odontologo.cedulas,
      '{{NOMBRE_DOCTOR}}': odontologo.nombres,
      '{{TELEFONO_DOCTOR}}': odontologo.telefonos,
      '{{LISTA_PRODUCTOS}}': buildHTML(prescripcion.productos),
      '{{RECOMENDACIONES}}': prescripcion.recomendaciones,
      '{{QR_INFORMATION}}': `${qr_code}`,
   }

   let options = {
      format: 'Letter'
   }

   html = html.replace(/{{FECHA_ACTUAL}}|{{NOMBRE_PACIENTE}}|{{APELLIDO_PACIENTE}}|{{CEDULA_PACIENTE}}|{{CEDULA_DOCTOR}}|{{NOMBRE_DOCTOR}}|{{TELEFONO_DOCTOR}}|{{LISTA_PRODUCTOS}}|{{RECOMENDACIONES}}|{{QR_INFORMATION}}/gi, (matched) => { return data[matched] })

   filePDF.create(html, options).toFile(path.join(__dirname, '../uploads') + `/${fileName}`, (err, res) => {
      if (err) next(err);

      req.body.filename = res.filename;
      next();
   });
}