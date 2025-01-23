const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const jsonImagesActionsNeopets = JSON.parse(fs.readFileSync('../images_actions.json', 'utf8'))

module.exports = {
    description: "El usuario se despide de todos con una imagen random",
    run: async(message) => {

        let number = (Math.floor(Math.random() * jsonImagesActionsNeopets["greetings"].length))

        // Crear un embed con los datos obtenidos
        const embed = new EmbedBuilder()
        .setColor(0x99FF00)
        .setDescription(` **${message.author.username}** Se despide      `)
        .setImage(jsonImagesActionsNeopets["greetings"][number])
        .setFooter({ text: jsonImagesActionsNeopets["greetings"][number] })


        message.channel.send({ embeds: [embed] });
    }
}