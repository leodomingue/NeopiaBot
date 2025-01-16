const { EmbedBuilder } = require('discord.js');
const axios = require("axios");
const cheerio = require("cheerio");
const jellyneo = require(`../../api/jellyneo.js`);
const fs = require("fs");

module.exports = {
    description: "Scrapea un item dado",
    run: async (message, args) => {
        // Verificamos que haya un ID de item valido
        if (!args.length) {
            message.reply("Por favor, proporciona un numero entre 1 y 67,731");
            return;
        }


        let item = args[0]; // Tomamos el ID

        if(item === "random"){
            item = (Math.floor(Math.random() * 50000) + 1).toString();
        }

        if(parseInt(item) < 1 || parseInt(item)  > 67731){
            message.reply("El ID proporcionado debe ser un número entre 1 y 67,731.");
            return;
        }


        const data = await jellyneo.itemDataByID(item);//await scrapeJellyNeoDataByItemID(item);
        console.log("Item ID recibido:", item);

        if (!data) {
            message.reply(`No se pudo obtener la información del objeto ${item}.Proporciona un numero entre 1 y 67,731 `);
            return;
        }

        // Crear un embed con los datos obtenidos
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(data.title || " ")
            .setDescription(data.description || " ")
            .addFields(
                { name: 'Categoría', value: data.category || "No disponible", inline: true },
                { name: 'Precio', value: data.price || "No disponible", inline: true },
            )
            .setImage(data.imgSrc || " ")
            .setFooter({ text: `https://items.jellyneo.net/item/${item}/` })

        message.channel.send({ embeds: [embed] });
    }
};

