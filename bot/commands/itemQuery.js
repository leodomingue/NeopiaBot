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

        const totalPages = Math.ceil(data.resultCount / queryArg.limit);
        let currentPage = 1;

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Neopets Items: ${data.resultCount} - Page ${currentPage} of ${totalPages}`);

        data.queryResult.forEach(item => {
            embed.addFields(
                { name: '\u200B', value: `**${item.itemName || "Nombre no Disponible"}**` },
                { name: 'Rarity', value: item.itemRarity || "No disponible", inline: true},
                { name: 'Precio', value: item.itemPrice || "No disponible", inline: true},
                { name: 'Link', value: item.itemLink || "No disponible"},
            )
        });
                
        const button_center= new ButtonBuilder().setCustomId('0').setLabel('-').setStyle(ButtonStyle.Danger).setDisabled(true);
        const button_left= new ButtonBuilder().setCustomId('left').setLabel('⬅️').setStyle(ButtonStyle.Success);
        const button_right = new ButtonBuilder().setCustomId('right').setLabel('➡️').setStyle(ButtonStyle.Success);
        
        const button_row = new ActionRowBuilder().addComponents(button_left, button_center, button_right);

        message.channel.send({ 
            embeds: [embed], 
            components: [button_row],
        });

        const collector = message.channel.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            time: 15_000 
        });

        collector.on('collect',  async(i) => {
            try {
                
                console.log('Interaccion')
                //await i.deferUpdate()
                
                if (i.user.id !== message.author.id) {
                    i.reply({ content: `These buttons aren't for you!`, flags: MessageFlags.Ephemeral });
                    return;
                }
                    
                if(i.customId === 'right'){
                    currentPage++;
                    queryArg.start += queryArg.limit;
                }
                else if(i.customId === 'left'){
                    currentPage--;
                    queryArg.start -= queryArg.limit;
                }
                
                data = await jellyneo.itemSearchQuery(queryArg);
                
                const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Neopets Items - Page ${currentPage} of ${totalPages}`);

                data.queryResult.forEach(item => {
                    embed.addFields(
                        { name: '\u200B', value: `**${item.itemName || "Nombre no Disponible"}**` },
                        { name: 'Rarity', value: item.itemRarity || "No disponible", inline: true},
                        { name: 'Precio', value: item.itemPrice || "No disponible", inline: true},
                        { name: 'Link', value: item.itemLink || "No disponible"},
                    )
                });

                button_left.setDisabled(currentPage === 1);
                button_right.setDisabled(currentPage === totalPages);

                await i.update({
                    embeds: [embed],
                    components: [button_row] 
                });        
                
                //Reseteamos el tiempo
                collector.resetTimer();

            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', (collected) => {
            console.log(`Hubo ${collected.size} interacciones.`);
        });
    }
};

