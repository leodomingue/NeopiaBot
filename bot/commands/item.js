const { EmbedBuilder } = require('discord.js');
const axios = require("axios");
const cheerio = require("cheerio");
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


        const data = await scrapeData(item);
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

async function scrapeData(item) {
    try {
        //CODIGO ORIGINAL https://github.com/leodomingue/Scraaping-Neopets.git
        const url = `https://items.jellyneo.net/item/${item}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Se encuentra toda la informacion
        const principalTargetDiv = $('div.row .large-9.small-12.columns.content-wrapper');
        if (!principalTargetDiv) return null;


        const title = principalTargetDiv.find('h1').text().trim();

        const firstSecondaryTargetDiv =  principalTargetDiv.find('div.large-3.push-2.small-12.columns');
        const imgSrc = firstSecondaryTargetDiv.find('p.text-center img').attr('src');
        const category = firstSecondaryTargetDiv.find('ul.small-block-grid-2.large-block-grid-1.no-padding li:nth-of-type(2)').find('a').text().trim();

        const secondSecondaryTargetDiv = principalTargetDiv.find('div.large-7.push-2.small-12.columns');


        const description = secondSecondaryTargetDiv.find("p").first().find('em').text().trim();

        let price;

        if (secondSecondaryTargetDiv.find("h3.entry-profile-header").text().split(' ')[0] === "DescriptionNeocash"){
            price =secondSecondaryTargetDiv.find("div.row .small-4.columns.text-center p strong.nc-text").text().trim();
        } else{
            price = secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[0] + " " + secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[1]
        }

        return { title, imgSrc, category, description, price };
    } catch (error) {
        console.error("Error durante el scraping:", error.message);
        return null;
    }
}