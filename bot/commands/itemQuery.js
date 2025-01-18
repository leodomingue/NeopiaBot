const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder , ComponentType, MessageFlags} = require('discord.js');
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

        var start = 0;

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
            "exclude_nc": null,
            "limit": 5,
            "start": start
        }

        var data = await jellyneo.itemSearchQuery(queryArg);//await scrapeJellyNeoDataByItemID(item);

        if (!data) {
            message.reply(`Hubo un error al intentar realizar la busqueda`);
            return;
        }

        if (!data.resultCount) {
            message.reply(`No se a encontrado ningun resultado`);
            return;
        }
        //message.reply(`Se encontraron ${data.resultCount} item/s`);

        var embedResults = []

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
            
            embedResults.push(embed)
        });

        const button_center= new ButtonBuilder().setCustomId('0').setLabel('-').setStyle(ButtonStyle.Danger).setDisabled(true);
        const button_left= new ButtonBuilder().setCustomId('left').setLabel('⬅️').setStyle(ButtonStyle.Success);
        const button_right = new ButtonBuilder().setCustomId('right').setLabel('➡️').setStyle(ButtonStyle.Success);
        
        const button_row = new ActionRowBuilder().addComponents(button_left, button_center, button_right);

        message.channel.send({ 
            embeds: embedResults, 
            components: [button_row],
        });

        const collector = message.channel.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            time: 15_000 
        });

        collector.on('collect',  async(i) => {
            try {
                console.log('Interaccion')
                //i.deferUpdate();
                if (i.user.id !== message.author.id) {
                    i.reply({ content: `These buttons aren't for you!`, flags: MessageFlags.Ephemeral });
                    return;
                }
                    
                if(i.customId === 'right'){
                    queryArg.start += 5;
                }

                if(i.customId === 'left'){
                    queryArg.start -= 5;
                }
                
                data = await jellyneo.itemSearchQuery(queryArg);
                
                var updatedEmbedResults = []
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
                    
                    updatedEmbedResults.push(embed)
                });

                //Y actualizamos la foto
                
                i.update({
                    embeds: [updatedEmbedResults],
                    components: [button_row]
                });               
            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', (collected) => {
            console.log(`Hubo ${collected.size} interacciones.`);
        });
    }
};

