const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction, ClientUser } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("volume")
            .setDescription("Sets the volume for a song.")
            .addIntegerOption((integerOption) => 
                integerOption
                .setName("volumepercent")
                .setDescription("Sets the volume to a target percentage.")
                .setRequired(false)
            ),
    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { String[] } args
     * @param { Client } client 
     */
    textExecute(message, args, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        if (args[1]) {
            let volumePercent = Number(args[1]);

            if (isNaN(volumePercent)) return message.reply("You have given an invalid number!");

            if (volumePercent === guildQueue.volume) return message.reply(`📢 Volume set to \`${volumePercent}\`%`);

            if (volumePercent > 100) volumePercent = 100;
            if (volumePercent < 1) volumePercent = 1;

            guildQueue.setVolume(volumePercent);

            return message.reply(`📢 Volume set to \`${volumePercent}\`%`);
        }
        
        return message.reply(`📢 Song volume is currently \`${guildQueue.volume}\`%`);
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     * @returns 
     */
    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let interactionOption = interaction.options.getInteger("volumepercent", false);

        if (interactionOption) {
            let volumePercent = interaction;

            if (isNaN(volumePercent)) return interaction.reply("You have given an invalid number!");

            if (volumePercent === guildQueue.volume) return interaction.reply(`📢 Volume set to \`${volumePercent}\`%`);

            if (volumePercent > 100) volumePercent = 100;
            if (volumePercent < 1) volumePercent = 1;

            guildQueue.setVolume(volumePercent);

            return interaction.reply(`📢 Volume set to \`${volumePercent}\`%`);
        }
        
        return interaction.reply(`📢 Song volume is currently \`${guildQueue.volume}\`%`);
    }
}