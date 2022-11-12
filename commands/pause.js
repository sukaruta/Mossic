const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("pause")
            .setDescription("Will pause the current queue if it exists and you have sufficient permission."),
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
        try {
            client.distube.pause(message.guild.id);
        } catch (err) {
            return message.reply({embeds: [
                handleDisTubeError(err)
            ]})
        }

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("⏸️ Song Queue paused.")
                    .setColor(Colors.Blue)
                    .setFooter({
                        text: `Paused by ${message.author.username}#${message.author.discriminator}`,
                        iconURL: message.author.avatarURL({
                            size: 32
                        })
                    })
            ]
        });
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        try {
            client.distube.pause(interaction.guild.id);
        } catch (err) {
            return interaction.reply({embeds: [
                handleDisTubeError(err)
            ]})
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("⏸️ Song Queue paused.")
                    .setColor(Colors.Blue)
                    .setFooter({
                        text: `Paused by ${interaction.user.username}#${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL({
                            size: 32
                        })
                    })
            ]
        });
    }
}