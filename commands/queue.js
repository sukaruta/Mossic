const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");
const queueEmbed = require("../functions/queueEmbed");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("queue")
            .setDescription("Displays the available songs in the server queue if it exists."),
    cooldown: 5,
    aliases: ["q", "que"],
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    textExecute(message, _, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        return message.reply({
            embeds: [queueEmbed(guildQueue, message.author)]
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

        return interaction.reply({
            embeds: [queueEmbed(guildQueue, interaction.user)]
        });
    }
}