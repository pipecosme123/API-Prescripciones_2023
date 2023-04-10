exports.buildHTML = (listProductos) => {

   let arrProductos = [];
   let html = '';

   listProductos.forEach(data => {
      
      let imagen = `https://imagenes.kagencia.com/prescripciones_2023/${data.imagenes}`
      let table = `
         <td>
            <div class="productos">
               <table>
                  <tbody>
                     <tr>
                        <td>
                           <div class="imagen-productos">
                              <img class="imagenProducto"
                                 src="${imagen}" />
                           </div>
                        </td>
                        <td>
                           <div class="informacion-productos">
                              <h3 class="titulo-informacion">${data.nombres}</h3>
                              <p class="descripcion-informacion">${data.usos}</p>
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </td>
      `

      arrProductos.push(table)
   });

   for (let i = 0; i < arrProductos.length; i++) {

      let code = '';
      if (i % 2 === 0) {
         code += ('<tr>' + arrProductos[i])

         if ((i + 1) === arrProductos.length) {
            code += '</tr>'
         }
      } else {
         code += (arrProductos[i] + '</tr>')
      }

      html += code;
   }

   return html;
}