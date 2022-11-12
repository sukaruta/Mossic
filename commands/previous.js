const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("previous")
            .setDescription("Will skip to the previous song in the queue."),
    aliases: ["prev"],
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async textExecute(message, _, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        try {
            await guildQueue.previous();
        } catch (err) {
            return message.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return message.reply("✅ Jumped back to previous song.");
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    async slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        try {
            await guildQueue.previous();
        } catch (err) {
            return interaction.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return interaction.reply("✅ Jumped back to previous song.");
    }
}