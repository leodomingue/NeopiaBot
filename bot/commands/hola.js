const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const jsonImagesActionsNeopets = JSON.parse(fs.readFileSync('../images_actions.json', 'utf8'))
const videotogif = require(`../../api/videotogif.js`);

module.exports = {
    description: "El usuario saluda a todos con una imagen random",
    run: async(message) => {

        let number = (Math.floor(Math.random() * jsonImagesActionsNeopets["greetingsVideo"].length))

        const gifbuffer = await videotogif.convertMp4ToGif(jsonImagesActionsNeopets["greetingsVideo"][number])


        const embed = new EmbedBuilder()
        .setColor(0x99FF00)
        .setDescription(`🎊 **${message.author.username}** saluda a todos 🎊    `)
        .setImage(`attachment://greetings.gif`)
        .setFooter({ text: jsonImagesActionsNeopets["greetingsVideo"][number] })


        await message.channel.send({
            embeds: [embed],
            files: [{ attachment: gifbuffer, name: 'greetings.gif' }], // Adjuntamos la imagen generada
        });
    }
}