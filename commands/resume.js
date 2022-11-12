const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("resume")
            .setDescription("Will resume the current queue if it exists and you have sufficient permission."),
    cooldown: 5,
    aliases: ["unpause", "res"],
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    textExecute(message, _, client) {
        try {
            client.distube.resume(message.guild.id);
        } catch (err) {
            return message.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("▶️ Song Queue resumed.")
                    .setColor(Colors.Blue)
                    .setFooter({
                        text: `Resumed by ${message.author.username}#${message.author.discriminator}`,
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
        try {
            client.distube.resume(interaction.guild.id);
        } catch (err) {
            return interaction.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("▶️ Song Queue resumed.")
                    .setColor(Colors.Blue)
                    .setFooter({
                        text: `Resumed by ${interaction.user.username}#${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL({
                            size: 32
                        })
                    })
            ]
        });   
    }
}