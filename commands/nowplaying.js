const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message } = require("discord.js");
const nowPlayingEmbed = require("../functions/nowPlayingEmbed");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("nowplaying")
            .setDescription("Will show the current song playing in the song queue."),
    aliases: ["np"],
    cooldown: 5,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    textExecute(message, _, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        const {
            user,
            name,
            thumbnail,
            duration,
            description,
            liveDuration
        } = guildQueue.songs[0];

        return message.reply({
            embeds: [nowPlayingEmbed(name, description, guildQueue.currentTime, duration, thumbnail, user, liveDuration)]
        })
    },

    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        const {
            user,
            name,
            thumbnail,
            duration,
            description
        } = guildQueue.songs[0];

        return interaction.reply({
            embeds: [nowPlayingEmbed(name, description, guildQueue.currentTime, duration, thumbnail, user)]
        })
    }
}