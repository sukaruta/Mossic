const { SlashCommandBuilder } = require("@discordjs/builders");
const { Message, Client, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Gives you data about the bot's connection health."),
    cooldown: 10,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async textExecute(message, _, client) {
        let pingEmbed = new EmbedBuilder()
            .setTitle("Pinging...")
            .setColor(Colors.Default)
            .addFields(
                { name: "Websocket Ping", value: `${client.ws.ping}ms` },
                { name: "Client Ping", value: "0ms" }
            )
            .setFooter(
                {
                    text: `Requested by ${message.author.username}#${message.author.discriminator}`,
                    iconURL: message.author.avatarURL({ size: 32 })
                }
            )

        const pingMsg = await message.reply({ embeds: [pingEmbed] });

        pingEmbed
        .setTitle("Pong! 🏓")
        .setFields(
            { name: "Websocket Ping", value: `${client.ws.ping}ms` }, 
            { name: "Client Ping", value: `${pingMsg.createdAt - message.createdAt}ms` }
            )
        .setColor(client.ws.ping < 100 ? Colors.Green : Colors.Red);

        pingMsg.edit({
            embeds: [pingEmbed]
        })

        return;
    },

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Client } client 
     */
    async slashExecute(interaction, client) {
        await interaction.deferReply();

        let pingEmbed = new EmbedBuilder()
            .setTitle("Pinging...")
            .setColor(Colors.Default)
            .addFields(
                { name: "Websocket Ping", value: `${client.ws.ping}ms` },
                { name: "Client Ping", value: "0ms" }
            )
            .setFooter(
                {
                    text: `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: interaction.user.avatarURL({ size: 32 })
                }
            )

        const pingInteraction = await interaction.editReply({
            embeds: [pingEmbed]
        });

        pingEmbed
        .setTitle("Pong! 🏓")
        .setFields(
            { name: "Websocket Ping", value: `${client.ws.ping}ms` }, 
            { name: "Client Ping", value: `${pingInteraction.createdAt - interaction.createdAt}ms` }
            )
        .setColor(client.ws.ping < 100 ? Colors.Green : Colors.Red);

        await interaction.editReply({
            embeds: [pingEmbed]
        });

        return;
    }
}