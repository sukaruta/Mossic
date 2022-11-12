const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Message, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");
const { RepeatMode } = require("distube");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("loop")
            .setDescription("Can specifically loop queue and song. Disable by typing \"disable\"")
            .addStringOption((stringOption) => 
            stringOption
            .setName("repeatmode")
            .setDescription("Sets which part of the queue to loop.")
            .setRequired(false)
            .addChoices(
                { name: "Disable", value: "DISABLE" },
                { name: "Song", value: "SONG" },
                { name: "Queue", value: "QUEUE" }
            )
            )
            ,
    cooldown: 5,
    inSameVoiceChannel: true,
    aliases: ["repeat"],
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
            let repeatMode = RepeatMode.DISABLED;

            switch (args[1].toUpperCase()) {
                case "DISABLE":
                    repeatMode = RepeatMode.DISABLED;
                    break;
                case "SONG":
                    repeatMode = RepeatMode.SONG;
                    break;
                case "QUEUE":
                    repeatMode = RepeatMode.QUEUE;
                    break;
                case "QUE":
                    repeatMode = RepeatMode.QUEUE;
                    break;
                default:
                    return message.reply("Invalid repeat mode given, can only be `DISABLE | SONG | QUEUE`");
                    break;
            } 
            
            guildQueue.setRepeatMode(repeatMode);
        }

        let isActive = true;

        if (guildQueue.repeatMode === RepeatMode.DISABLED) isActive = false;

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Queue Repeat Mode Toggle")
                    .addFields(
                        { name: "Current Mode", value: `${getStringRepresentationOfEnum(guildQueue.repeatMode)}` },
                        { name: "Is Repeat Active", value: `${isActive}` }
                    )
                    .setColor(Colors.Aqua)
                    .setFooter({
                        text: `Requested by ${message.author.username}#${message.author.discriminator}`,
                        iconURL: message.author.avatarURL({
                            size: 32
                        })
                    })
            ]
        });

        function getStringRepresentationOfEnum(rM) {
            switch (rM) {
                case RepeatMode.DISABLED:
                    return "DISABLED";
                case RepeatMode.QUEUE:
                    return "QUEUE";
                case RepeatMode.SONG:
                    return "SONG";
            }
        }
    },

    /**
     * 
     * @param { Client } client 
     * @param { CommandInteraction } interaction 
     */
     async slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let interactionOption = interaction.options.getString("repeatmode", false);

        if (interactionOption) {
            let repeatMode = RepeatMode.DISABLED;

            switch (interactionOption) {
                case "DISABLE":
                    repeatMode = RepeatMode.DISABLED;
                    break;
                case "SONG":
                    repeatMode = RepeatMode.SONG;
                    break;
                case "QUEUE":
                    repeatMode = RepeatMode.QUEUE;
                    break;
                case "QUE":
                    repeatMode = RepeatMode.QUEUE;
                    break;
                default:
                    return interaction.reply("Invalid repeat mode given, can only be `DISABLE | SONG | QUEUE`");
                    break;
            } 
            
            guildQueue.setRepeatMode(repeatMode);
        }

        let isActive = true;

        if (guildQueue.repeatMode === RepeatMode.DISABLED) isActive = false;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Queue Repeat Mode Toggle")
                    .addFields(
                        { name: "Current Mode", value: `${getStringRepresentationOfEnum(guildQueue.repeatMode)}` },
                        { name: "Is Repeat Active", value: `${isActive}` }
                    )
                    .setColor(Colors.Aqua)
                    .setFooter({
                        text: `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL({
                            size: 32
                        })
                    })
            ]
        });

        function getStringRepresentationOfEnum(rM) {
            switch (rM) {
                case RepeatMode.DISABLED:
                    return "DISABLED";
                case RepeatMode.QUEUE:
                    return "QUEUE";
                case RepeatMode.SONG:
                    return "SONG";
            }
        }
    }
}