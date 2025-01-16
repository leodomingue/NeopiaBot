const { EmbedBuilder } = require('discord.js');
const axios = require("axios");
const cheerio = require("cheerio");
const jellyneo = require(`../../api/jellyneo.js`);
const fs = require("fs");

module.exports = {
    description: "Busca Items segun una serie de Filtros",
    run: async (message, args) => {
        // Verificamos que haya un ID de item valido
        if (!args.length) {
            message.reply("Por favor, proporciona un query valido");
            return;
        }

        let itemName = args[0]; // Tomamos el ID

        queryArg= {
            "name": itemName,
            "name_type": null,
            "cat": null,  
            "scat": null,
            "scat_type": null,
            "scat_active": null,
            "min_rarity": null, 
            "max_rarity": null,
            "min_price": null, 
            "max_price": null,
            "exclude_nc": null
        }

        const data = await jellyneo.itemSearchQuery(queryArg);//await scrapeJellyNeoDataByItemID(item);

        if (!data) {
            message.reply(`Hubo un error al intentar realizar la busqueda`);
            return;
        }

        if (!data.resultCount) {
            message.reply(`No se a encontrado ningun resultado`);
            return;
        }
        message.reply(`Se encontraron ${data.resultCount} item/s`);

        data.queryResult.forEach(item => {
            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(item.itemName || " ")
            .addFields(
                { name: 'Rarity', value: item.itemRarity || "No disponible", inline: true },
                { name: 'Precio', value: item.itemPrice || "No disponible", inline: true },
            )
            .setImage(item.itemImg || " ")
            .setFooter({ text: item.itemLink })

            message.channel.send({ embeds: [embed] });
        });
    }
};

