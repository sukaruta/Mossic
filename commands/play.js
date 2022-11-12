const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("play")
            .setDescription("Will play requested music if you are in a valid voice channel.")
            .addStringOption((stringOption) => 
                stringOption
                .setName("query")
                .setDescription("Can accept search keywords or a url from Youtube.")
                .setRequired(true)
            ),
    aliases: ["p"],
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { String[] } args 
     * @param { Client } client 
     */
    async textExecute(message, args, client) {
        const searchQuery = args.slice(1).join(" ");
        if (searchQuery.length === 0 || searchQuery.length > 200) return message.reply("You must provide a valid query and it cannot be longer than 200 characters!");
        console.log(searchQuery);

        const { channel: voiceChannel } = message.member.voice;
        if (!voiceChannel) return message.reply("You are not in a voice channel!");

        try {
            await client.distube.play(voiceChannel, searchQuery, {
                member: message.member,
                textChannel: message.channel,
                message: message
            });            
        } catch (err) {
            return message.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return;
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    async slashExecute(interaction, client) {
        const searchQuery = interaction.options.getString("query", true);
        if (searchQuery.length === 0 || searchQuery.length > 200) return interaction.reply("You must provide a valid query and it cannot be longer than 200 characters!");

        const { channel: voiceChannel } = interaction.member.voice;
        if (!voiceChannel) return interaction.reply("You are not in a voice channel!");

        await interaction.deferReply();

        try {
            await client.distube.play(voiceChannel, searchQuery, {
                member: interaction.member,
                textChannel: interaction.channel
            });            
        } catch (err) {
            return interaction.editReply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return interaction.editReply("🎵 Request accepted!");
    }
}