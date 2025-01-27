const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const jsonImagesActionsNeopets = JSON.parse(fs.readFileSync('../images_actions.json', 'utf8'))

module.exports = {
    description: "El usuario se despide de todos con una imagen random",
    run: async(message) => {
    
        let number = (Math.floor(Math.random() * jsonImagesActionsNeopets["goodbyeVideo"].length))

        const gifbuffer = await videotogif.convertMp4ToGif(jsonImagesActionsNeopets["goodbyeVideo"][number])


        const embed = new EmbedBuilder()
        .setColor(0x99FF00)
        .setDescription(`🎊 **${message.author.username}** Se despide de todos 🎊    `)
        .setImage(`attachment://goodbye.gif`)
        .setFooter({ text: jsonImagesActionsNeopets["goodbyeVideo"][number] })


        await message.channel.send({
            embeds: [embed],
            files: [{ attachment: gifbuffer, name: 'goodbye.gif' }], // Adjuntamos la imagen generada
        });
    }
}