const tmp = require('tmp');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const fs = require('fs');
const { PassThrough } = require('stream');

module.exports = {
    description: "Funciones que ayudan pasar un MP4 a GIF",

     /**
     * Convierte un video MP4 a GIF 
     * @param {string} URL - La URL del video MP4 a convertir.
     * @returns {Buffer} - Un buffer que contiene el GIF 
     */
    convertMp4ToGif: async (URL) => {
        try {
            // Obtenemos el video
            const response = await axios({
                method: 'get',
                url: URL,
                responseType: 'stream',
            });


            // Creamos un archivo temporal para el video
            const tempFile = tmp.fileSync({ postfix: '.mp4' });

            // Creaamos un flujo para guardar los datos en el archivo temporal
            const writeStream = fs.createWriteStream(tempFile.name);

            // Conectamos el archivo temporal con el video descargado
            response.data.pipe(writeStream);


            // Esperamos a que se termine el videio
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });


            // Creamos flujo para la salida en GIF
            const gifStream = new PassThrough();

            // Convertimos el video en GIF
            const gifBuffer = await new Promise((resolve, reject) => {
                ffmpeg(tempFile.name)
                    .toFormat('gif')
                    .on('error', (err) => {
                        console.error('Error al convertir:', err.message);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log('Conversión completada');
                    })
                    .pipe(gifStream); //Enviamos los datos de gif a la memoria

                // Concatenemos los datos para crear el gif
                const chunks = [];
                gifStream.on('data', (chunk) => chunks.push(chunk));
                gifStream.on('end', () => resolve(Buffer.concat(chunks))); //combinamos en un unico buffer
            });

            // Eliminamos el archivo tmeporal
            tempFile.removeCallback();

            return gifBuffer;

        } catch (err) {
            console.error('Error en la conversión:', err.message);
            throw err;
        }
    }
};
