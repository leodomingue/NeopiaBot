const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { createCanvas, loadImage } = require('canvas');
const jsonDataIDNeopets = JSON.parse(fs.readFileSync('../data_neopets_ID.json', 'utf8'));
const jellyneo = require("./jellyneo.js");

module.exports = {
    description: "Funciones que ayudan a crear iamgenes de forma dinamica",
    /**
     * Crea un buffer de imagen con una matriz/grid numerada.

     * @param {string[]} imageUrl - URLs de las imágenes
     * @param {number[]} gridColsRows - Cantidad de filas y columnas de la matriz/grid.
     * @param {number[]} imageSize - Dimensiones de cada imagen (ancho, alto).
     * @param {number} fontSize - Tamaño de la fuente para los números.

     * @returns {Buffer|null}  Devuelve Buffer de la imagen generada, o `null` en caso de error.
     */

    createImageGridBuffer: async(imageUrl, gridColsRows, imageSize, fontSize)=> {
        try {
            //Extraemos las filas columnas y tamaño de cada iamgen
            const [rows, cols] = gridColsRows;
            const [imgWidth, imgHeight] = imageSize;
        
            // calculamos tamaño total de la iamgen
            const gridWidth = cols * imgWidth;
            const gridHeight = rows * (imgHeight + fontSize);//Incluimos tamaño de fuente
        
            //Creamos el grid
            const canvas = createCanvas(gridWidth, gridHeight);
            const ctx = canvas.getContext('2d');
        
            // Fondo blanco
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, gridWidth, gridHeight);
        
            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
        
            const imagePromises = [];
            for (let idx = 0; idx < rows * cols; idx++) {
                //Funcion especial de canvas para cargar imagenes
                imagePromises.push(loadImage(imageUrl[idx]).then(img => {

                    //Pegamos y dibujamos las iamgenes y nuemros
                    const row = Math.floor(idx / cols);
                    const col = idx % cols;
        
                    const x = col * imgWidth;
                    const y = row * (imgHeight + fontSize);
        
                    ctx.drawImage(img, x, y, imgWidth, imgHeight);
        
                    const text_x = x + imgWidth / 2;
                    const text_y = y + imgHeight + fontSize / 2;
                    ctx.fillText((idx + 1).toString(), text_x, text_y);

                }).catch(error => {

                    console.error(`Error al cargar la imagen  ${idx}:`, error);

                }));
            }
        
            // Esperamos a que todas las imágenes se carguen antes de devolver el buffer
            await Promise.all(imagePromises);
        
            return canvas.toBuffer();
        }catch (error) {
            console.error("Error: ", error.message);
            return null;
        }
    },

    /**
     * Dada una pagina se obtiene las URLs de las imágenes

     * @param {number} page - Número de página que se desea cargar.

     * @returns {Promise<string[]>} Lista de URLs de imágenes.
     */
    getImageUrls: async(page)=> {
        const URLimages = [];
        for (let idx = page * 9 +1; idx < page * 9 + 1 + 9; idx++) {
            // Obtenemos el ID real desde el JSON
            const real_ID = Number(jsonDataIDNeopets[String(idx)])
            // Obtenemos los datos de la imagen usando la función de 'jellyneo'
            const data = await jellyneo.PhotoDataByID(real_ID)
            URLimages.push(data.imgSrc);
        }
        return URLimages;
    }

}