const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder , ComponentType, MessageFlags} = require('discord.js');
const jellyneo = require(`../../api/jellyneo.js`);
const fs = require('fs');

module.exports = {
    description: "Realiza una busqueda interactiva dado un menu de imagenes",
    run: async(message) => {

        const jsonDataIDNeopets = JSON.parse(fs.readFileSync('../data_neopets_ID.json', 'utf8'));

        let page = 0;


        const embed = new EmbedBuilder()
                .setTitle(`Imagen ${page + 1}`)
                .setImage(`https://neopetsimages.s3.sa-east-1.amazonaws.com/neopets_images/grid_result${page}.png`)
                .setColor(0x00AE86)
                .setFooter({ text: `Página ${page + 1} de 6.483` });

        //Creamos los botones
        const button_1 = new ButtonBuilder().setCustomId('1').setLabel('1').setStyle(ButtonStyle.Secondary);
        const button_2 = new ButtonBuilder().setCustomId('2').setLabel('2').setStyle(ButtonStyle.Secondary);
        const button_3 = new ButtonBuilder().setCustomId('3').setLabel('3').setStyle(ButtonStyle.Secondary);
        const button_4 = new ButtonBuilder().setCustomId('4').setLabel('4').setStyle(ButtonStyle.Secondary);
        const button_5 = new ButtonBuilder().setCustomId('5').setLabel('5').setStyle(ButtonStyle.Secondary);
        const button_6 = new ButtonBuilder().setCustomId('6').setLabel('6').setStyle(ButtonStyle.Secondary);
        const button_7 = new ButtonBuilder().setCustomId('7').setLabel('7').setStyle(ButtonStyle.Secondary);
        const button_8 = new ButtonBuilder().setCustomId('8').setLabel('8').setStyle(ButtonStyle.Secondary);
        const button_9 = new ButtonBuilder().setCustomId('9').setLabel('9').setStyle(ButtonStyle.Secondary);
        const button_center= new ButtonBuilder().setCustomId('0').setLabel('-').setStyle(ButtonStyle.Danger).setDisabled(true);
        const button_left= new ButtonBuilder().setCustomId('left').setLabel('⬅️').setStyle(ButtonStyle.Success);
        const button_right = new ButtonBuilder().setCustomId('right').setLabel('➡️').setStyle(ButtonStyle.Success);

        //Primera linea contiene los botones del 1 al 3
        const row_1 = new ActionRowBuilder().addComponents(button_1, button_2, button_3);

        //Primera linea contiene los botones del 4 al 6
        const row_2 = new ActionRowBuilder().addComponents(button_4, button_5, button_6);

        //Primera linea contiene los botones del 4 al 6
        const row_3 = new ActionRowBuilder().addComponents(button_7, button_8, button_9);


        //3er linea contiene los botones para cambiar de pagina
        const row_4 = new ActionRowBuilder().addComponents(button_left, button_center, button_right);

        //Mostramos el mensaje con los botnes y el contenido
        await message.channel.send({
            embeds: [embed],
            components: [row_1, row_2, row_3, row_4],
        });

        // Creamos el colector de interacciones en el mismo canal de texto donde se escribio el mensaje
        const collector = message.channel.createMessageComponentCollector({
            componentType: ComponentType.Button, //La interaccion
            time: 30_000, //Tiempo de respuesta
        });

        collector.on('collect', async (i) => { //Vemos la interrracion i
            try {
                // Validamos que el usuario que interactuó sea el mismo que ejecutó el comando
                if (i.user.id === message.author.id) {
                    //Si toca los las flechas, cambiamos de pagina y de foto
                    if (i.customId === 'right' || i.customId === 'left' ){
                        if(i.customId === 'right'){
                            if(page < 7500){
                                page++;
                            }
                        } else{
                            if (page > 0){
                                page--;
                            }
                        }

                        //Y actualizamos la foto
                        const updatedEmbed = new EmbedBuilder()
                            .setTitle(`Imagen ${page + 1}`)
                            .setImage(`https://neopetsimages.s3.sa-east-1.amazonaws.com/neopets_images/grid_result${page}.png`)
                            .setColor(0x0099FF)
                            .setFooter({ text: `Página ${page + 1} de 6.483` });

                        await i.update({
                            embeds: [updatedEmbed]
                        });

                        //Reseteamos el tiempo
                        collector.resetTimer();

                    }else{
                        //Indicamos que se procesa la solicitud
                        await i.deferUpdate();
                        //Si toca algun numero, vemos el ID correspondiente y llamamos a la funcion de scrapeo
                        const ID = Number(i.customId) + Number(page*9);
                        const real_ID = Number(jsonDataIDNeopets[String(ID)]) //Buscamos el ID relacionado a la pagina en el json
                        const data = await jellyneo.itemDataByID(real_ID)
                        const embed = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(data.title || " ")
                                    .setDescription(data.description || " ")
                                    .addFields(
                                        { name: 'Categoría', value: data.category || "No disponible", inline: true },
                                        { name: 'Precio', value: data.price || "No disponible", inline: true },
                                    )
                                    .setImage(data.imgSrc || " ")
                                    .setFooter({ text: `https://items.jellyneo.net/item/${real_ID}/` })

                        await message.channel.send({ embeds: [embed] })
                    }

                } else {
                    await i.reply({ content: `No deberías interactuar con estos botones ${i.user.id}. No sos ${message.author.id}`, ephemeral: true });
                }
            } catch (error) {
                console.error(error);
            }
        });

        //Una vez que pasa el tiempo. En cosola aparece las interacciones que hubo
        collector.on('end', (collected) => {
            console.log(`Hubo ${collected.size} interacciones.`);
        });
    }
};
