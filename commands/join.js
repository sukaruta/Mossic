const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, Constants, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("join")
            .setDescription("Will attempt to join your voice channel.")
            .addChannelOption((channelOption) => 
            channelOption
            .setName("voicechannel")
            .setDescription("The voice channel to join in.")
            .setRequired(false)
            )
            ,
    cooldown: 5,
    /**
     * 
     * @param { Message } message 
     * @param { String[] } args
     * @param { Client } client 
     */
    async textExecute(message, args, client) {
        if (args[1]) {
            console.log(args[1].replace(/<|#|>/g, ""));
            const channel = await client.channels.fetch(args[1].replace(/<|#|>/g, ""));
            if (!Constants.VoiceBasedChannelTypes.includes(channel.type)) return message.reply("You did not give a valid voice channel.");

            try {
               await client.distube.voices.join(channel);
            } catch (err) {
                return message.reply({ embeds: [handleDisTubeError(err)] });
            }

            return message.reply(`📻 Joined voice channel \`${channel.name}\``);
        }

        const { channel: voiceChannel } = message.member.voice;
        if (!voiceChannel) return message.reply("You are not in a voice channel!");

        const me = await message.guild.members.fetchMe();
        
        if (me.voice.channel && voiceChannel.id !== me.voice.channel.id && me.voice.channel.members.size !== 1) 
        return message.reply("You must be in the same voice channel as I am in.");

        try {
            await client.distube.voices.join(voiceChannel);
         } catch (err) {
             return message.reply({ embeds: [handleDisTubeError(err)] });
         }

        return message.reply(`📻 Joined voice channel \`${message.member.voice.channel.name}\``);
    },

    /**
     * 
     * @param { Client } client 
     * @param { CommandInteraction } interaction 
     */
    async slashExecute(interaction, client) {
        let interactionOption = interaction.options.getChannel("voicechannel", false);

        if (interactionOption) {
            const channel = interactionOption;
            if (!Constants.VoiceBasedChannelTypes.includes(channel.type)) return interaction.reply("You did not give a valid voice channel.");

            await interaction.deferReply();

            try {
               await client.distube.voices.join(channel);
            } catch (err) {
                return interaction.editReply({ embeds: [handleDisTubeError(err)] });
            }

            return interaction.editReply(`📻 Joined voice channel \`${channel.name}\``);
        }

        const { channel: voiceChannel } = interaction.member.voice;
        if (!voiceChannel) return interaction.reply("You are not in a voice channel!");

        const me = await interaction.guild.members.fetchMe();
        
        if (me.voice.channel && voiceChannel.id !== me.voice.channel.id && me.voice.channel.members.size !== 1) 
        return interaction.reply("You must be in the same voice channel as I am in.");

        await interaction.deferReply();

        try {
            await client.distube.voices.join(voiceChannel);
         } catch (err) {
             return interaction.editReply({ embeds: [handleDisTubeError(err)] });
         }

        return interaction.editReply(`📻 Joined voice channel \`${voiceChannel.name}\``);
    }
}