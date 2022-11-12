const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("autoplay")
            .setDescription("Toggle bot's ability to add random songs to queue after it ends."),
    aliases: ["ap"],
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    textExecute(message, _, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("AutoPlay Toggle")
                .setDescription(`Autoplay has been \`${ guildQueue.toggleAutoplay() ? "enabled" : "disabled" }\``)
                .setColor(Colors.Red)
                .setFooter({
                    text: `Requested by ${message.author.username}#${message.author.discriminator}`,
                    iconURL: message.author.avatarURL({
                        size: 32
                    })
                })   
            ]
        });
    },

    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("AutoPlay Toggle")
                .setDescription(`Autoplay has been \`${ guildQueue.toggleAutoplay() ? "enabled" : "disabled" }\``)
                .setColor(Colors.Red)
                .setFooter({
                    text: `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: interaction.user.avatarURL({
                        size: 32
                    })
                })   
            ]
        });
    }
}