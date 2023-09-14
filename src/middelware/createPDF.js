const fs = require('fs');
const filePDF = require('html-pdf');
const qrcode = require("qrcode");
const path = require('path');
const { buildHTML } = require('../helpers/buildHTML');
const { base64Image } = require('../helpers/base64Image');

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
   const domain = `https://${req.headers.host}`;
   const encoded = Buffer.from(prescripcion.id.toString()).toString('base64');

   let info = encodeURI(`${domain}/api/prescripcion/${encoded}`);

   let qr_code = await createQRCode(info);

   let data = {
      '{{LOGO_COLGATE}}': await base64Image(path.join(__dirname, '../view/LogoColgate.svg'), 'svg+xml'),
      '{{FECHA_ACTUAL}}': getFecha(),
      '{{NOMBRE_PACIENTE}}': paciente.nombre,
      '{{APELLIDO_PACIENTE}}': paciente.apellido,
      '{{CEDULA_PACIENTE}}': new Intl.NumberFormat('es-MX').format(paciente.cedula),
      '{{CEDULA_DOCTOR}}': odontologo.cedulas,
      '{{NOMBRE_DOCTOR}}': odontologo.nombres,
      '{{APELLIDO_DOCTOR}}': odontologo.apellidos,
      '{{TELEFONO_DOCTOR}}': odontologo.telefono,
      '{{LISTA_PRODUCTOS}}': await buildHTML({ productos: prescripcion.productos }),
      '{{RECOMENDACIONES}}': prescripcion.recomendaciones,
      '{{QR_INFORMATION}}': `${qr_code}`,
      '{{FIRMA_DOCTOR}}': await base64Image(odontologo.firma),
      '{{SELLO_DOCTOR}}': await base64Image(odontologo.sello),
   }

   let options = {
      format: 'Letter'
   }

   html = html.replace(/{{LOGO_COLGATE}}|{{FECHA_ACTUAL}}|{{NOMBRE_PACIENTE}}|{{APELLIDO_PACIENTE}}|{{CEDULA_PACIENTE}}|{{CEDULA_DOCTOR}}|{{NOMBRE_DOCTOR}}|{{APELLIDO_DOCTOR}}|{{TELEFONO_DOCTOR}}|{{LISTA_PRODUCTOS}}|{{RECOMENDACIONES}}|{{QR_INFORMATION}}|{{FIRMA_DOCTOR}}|{{SELLO_DOCTOR}}/gi, (matched) => { return data[matched] })

   filePDF.create(html, options).toFile(path.join(__dirname, '../uploads') + `/${fileName}`, (err, res) => {
      if (err) next(err);

      req.body.filename = res.filename;
      next();
   });
}