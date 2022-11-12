const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("stop")
            .setDescription("Will stop the music queue."),
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
            await guildQueue.stop();
        } catch (err) {
            return message.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return message.reply("⏹️ Music Queue has been stopped.");
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    async slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        await interaction.deferReply();

        try {
            await guildQueue.stop();
        } catch (err) {
            return interaction.editReply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return interaction.editReply("⏹️ Music Queue has been stopped.");
    }
}