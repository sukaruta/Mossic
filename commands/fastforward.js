const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("fastforward")
            .setDescription("Will skip given amount of seconds in the current song.")
            .addIntegerOption((integerOption) => 
            integerOption
            .setName("seconds")
            .setDescription("How many seconds to skip.")
            .setRequired(false)
            ),
    aliases: ["ff", "forward"],
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

            if (seconds + guildQueue.currentTime > guildQueue.songs[0].duration) seconds = guildQueue.songs[0].duration;

            guildQueue.currentTime += seconds;
            guildQueue.seek(guildQueue.currentTime + seconds);

            message.reply(`Song fast forwarded by \`${seconds}\` seconds.`);
            return;
        }

        guildQueue.currentTime += 5;
        guildQueue.seek(guildQueue.currentTime + 5);
        message.reply(`Song fast forwarded by \`5\` seconds.`);
    },

    /**
     * 
     * @param { Client } client 
     * @param { CommandInteraction } interaction 
     */
    slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let interactionOption = interaction.options.get("seconds", false);

        if (interactionOption) {
            let seconds = Number(interactionOption.value);

            if (isNaN(seconds)) return interaction.reply("Please enter a valid number!");

            if (seconds + guildQueue.currentTime > guildQueue.songs[0].duration) seconds = guildQueue.songs[0].duration;

            guildQueue.currentTime += seconds;
            guildQueue.seek(guildQueue.currentTime + seconds);

            return interaction.reply(`Song fast forwarded by \`${seconds}\` seconds.`);
        }

        guildQueue.currentTime += 5;
        guildQueue.seek(guildQueue.currentTime + 5);
        return interaction.reply(`Song fast forwarded by \`5\` seconds.`);
    }
}