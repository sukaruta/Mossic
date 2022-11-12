const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("leave")
            .setDescription("Will attempt to leave current existing voice channel."),
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async textExecute(message, _, client) {
        const me = await message.guild.members.fetchMe();

        if (!me.voice.channel) return message.reply("I am not in any existing voice channel to leave.");

        client.distube.voices.leave(message.guild.id);

        return message.reply(`📞 Left voice channel \`${me.voice.channel.name}\``);
    },

    /**
     * 
     * @param { Client } client 
     * @param { CommandInteraction } interaction 
     */
    async slashExecute(interaction, client) {
        const me = await interaction.guild.members.fetchMe();

        if (!me.voice.channel) return interaction.reply("I am not in any existing voice channel to leave.");

        client.distube.voices.leave(interaction.guild.id);

        return interaction.reply(`📞 Left voice channel \`${me.voice.channel.name}\``);
    }
}