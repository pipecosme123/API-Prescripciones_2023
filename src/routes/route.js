const express = require('express');

const { createPDF } = require('../middelware/createPDF');
const { downloadFiles, deleteFiles } = require('../helpers/gestionFiles');
const { post_data_prescripcion, get_imagenes_productos, login, get_lista_productos, post_imagen_firma_sello, get_prescripcion } = require('../middelware/database');
const { validateDataUsers } = require('../middelware/loginUsers');
const { getDataAuth } = require('../middelware/getDataAuth');
const { verificarToken } = require('../middelware/token');
const fileUpload = require('../middelware/fileUpload');
const { compressImage } = require('../middelware/compressImage');
const { varificarRol } = require('../middelware/checkRolAuth');
const { buildJson } = require('../middelware/builJson');

const app = express();

app.get('/login', getDataAuth, login, validateDataUsers);
app.get('/products', verificarToken, get_lista_productos);
app.get('/prescripcion/:id', get_prescripcion, buildJson);
// app.get('/prescripcion', verificarToken, varificarRol(['lector']), get_prescripcion);
app.post('/prescripcion/add', verificarToken, post_data_prescripcion, get_imagenes_productos, createPDF, downloadFiles, deleteFiles);
app.post('/images/upload', verificarToken, fileUpload, compressImage, post_imagen_firma_sello);
app.put('/images/change', verificarToken, fileUpload, compressImage);

module.exports = app;