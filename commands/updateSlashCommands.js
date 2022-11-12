const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Client, Message, Routes } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("updateslashcommands")
            .setDescription("N/A"),
    cooldown: 5,
    isPrivate: true,
    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async textExecute(message, _, client) {
        const commands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        const clientId = client.user.id;
        const guildId = process.env.DEV_GUILD;

        for (const file of commandFiles) {
	        const command = require(`./${file}`);
            if (!command.isPrivate) commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        (async () => {
            try {
                message.channel.send("Started refreshing application (/) commands.");

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands }
                );

                message.channel.send("Successfully reloaded application (/) commands.");
            } catch (err) {
                console.error(err);
            }
        })();
        return;
    }
}