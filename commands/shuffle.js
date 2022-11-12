const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("shuffle")
            .setDescription("Shuffles the order of songs in the song queue."),
    aliases: ["shuffle", "shuf", "sh"],
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
            await guildQueue.shuffle();
        } catch (err) {
            return message.reply({
                embeds: [
                    handleDisTubeError(err, "Failed to shuffle the queue.")
                ]
            });
        }

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("🔀 Queue shuffled")
                .setDescription(`The song queue has been shuffled. `)
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
            await guildQueue.shuffle();
        } catch (err) {
            return interaction.editReply({
                embeds: [
                    handleDisTubeError(err, "Failed to shuffle the queue.")
                ]
            });
        }

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("🔀 Queue shuffled")
                .setDescription(`The song queue has been shuffled. `)
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