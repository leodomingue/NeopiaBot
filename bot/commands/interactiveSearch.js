const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder , ComponentType, MessageFlags} = require('discord.js');
module.exports = {
    description: "Realiza una busqueda interactiva dado un menu de imagenes",
    run: async(message) => {

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
            content: 'Botones:',
            components: [row_1, row_2, row_3, row_4],
        });

        // Creamos el colector de interacciones en el mismo canal de texto donde se escribio el mensaje
        const collector = message.channel.createMessageComponentCollector({
            componentType: ComponentType.Button, //La interaccion
            time: 15_000, //Tiempo de respuesta
        });

        collector.on('collect', async (i) => { //Vemos la interrracion i
            try {
                // Validamos que el usuario que interactuó sea el mismo que ejecutó el comando
                if (i.user.id === message.author.id) {
                    await i.reply({ content: `Clickeaste en el botón ${i.customId}`, ephemeral: true });
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