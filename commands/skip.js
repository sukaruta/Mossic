const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");
const handleDisTubeError = require("../functions/handleDisTubeError");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("skip")
            .setDescription("Will skip to a requested song in the queue.")
            .addIntegerOption((integerOption) => 
            integerOption
            .setName("position")
            .setDescription("The song position in the queue to jump to.")
            .setRequired(false)
            ),
    aliases: ["s"],
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { String[] } args
     * @param { Client } client 
     */
    async textExecute(message, args, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        if (args[1]) {
            let position = Number(args[1]);

            if (isNaN(position)) return message.reply("Please enter a valid number!");

            if (position > guildQueue.songs.length) position = guildQueue.songs.length - 1;
            if (position < 0) position = 0;

            try {
               await guildQueue.jump(position - 1);
            } catch (err) {
                return message.reply({
                    embeds: [handleDisTubeError(err)]
                });
            }
    
            return message.reply("✅ Skipped to requested song position.");
        }

        try {
            await guildQueue.skip();
        } catch (err) {
            return message.reply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return message.reply("✅ Skipped to next song.");
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    async slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let interactionOption = interaction.options.getInteger("position", false);

        if (interactionOption) {
            let position = interactionOption;

            if (isNaN(position)) return interaction.reply("Please enter a valid number!");

            if (position > guildQueue.songs.length) position = guildQueue.songs.length - 1;

            await interaction.deferReply();

            try {
               await guildQueue.jump(position - 1);
            } catch (err) {
                return interaction.editReply({
                    embeds: [handleDisTubeError(err)]
                });
            }
    
            return interaction.editReply("✅ Skipped to requested song position.");
        }

        await interaction.deferReply();

        try {
            await guildQueue.skip();
        } catch (err) {
            return interaction.editReply({
                embeds: [handleDisTubeError(err)]
            });
        }

        return interaction.editReply("✅ Skipped to next song.");
    }
}