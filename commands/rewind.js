const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("rewind")
            .setDescription("Will rewind given amount of seconds in the current song.")
            .addIntegerOption((integerOption) => 
            integerOption
            .setName("seconds")
            .setDescription("How many seconds to rewind.")
            .setRequired(false)
            ),
    aliases: ["rew", "backward"],
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
            let seconds = Number(args[1]);

            if (isNaN(seconds)) return message.reply("Please enter a valid number!");

            if ((guildQueue.currentTime - -seconds) < 0) seconds = guildQueue.currentTime;

            guildQueue.currentTime -= seconds;
            guildQueue.seek(guildQueue.currentTime - seconds);
            message.reply(`Song rewinded by \`${seconds}\` seconds.`);
            return;
        }
        
        guildQueue.currentTime -= 5;
        guildQueue.seek(guildQueue.currentTime - 5);
        message.reply(`Song fast forwarded by \`-5\` seconds.`);
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let interactionOption = interaction.options.getInteger("seconds", false);

        if (interactionOption) {
            let seconds = interactionOption;

            if (isNaN(seconds)) return interaction.reply("Please enter a valid number!");

            if ((guildQueue.currentTime - -seconds) < 0) seconds = guildQueue.currentTime;

            guildQueue.currentTime -= seconds;
            guildQueue.seek(guildQueue.currentTime - seconds);

            return interaction.reply(`Song rewinded by \`${seconds}\` seconds.`);
        }
        
        guildQueue.currentTime -= 5;
        guildQueue.seek(guildQueue.currentTime - 5);
        return interaction.reply(`Song fast forwarded by \`-5\` seconds.`);
    }
}