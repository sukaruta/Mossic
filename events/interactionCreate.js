const { Client, CommandInteraction, Collection } = require("discord.js");

/**
 * 
 * @param { Client } client 
 * @param { CommandInteraction } interaction 
 */
module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.user.bot) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection());

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationDate = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationDate) {
            const timeLeft = (expirationDate - now) / 1000;
            var sec = 'seconds';
            if (timeLeft.toFixed(1) <= 1.0) sec = 'second';
            
            return interaction.reply(`Please wait ${timeLeft.toFixed(1)} ${sec} before reusing this command.`);
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        if (command.isPrivate && interaction.user.id !== '316779865380618242') return;

        if (command.inSameVoiceChannel) {
            const { channel: voiceChannel } = interaction.member.voice;
            if (!voiceChannel) return interaction.reply("You are not in a voice channel!");

            const me = await interaction.guild.members.fetchMe();
            
            if (me.voice.channel && voiceChannel.id !== me.voice.channel.id && me.voice.channel.members.size !== 1) 
            return interaction.reply("You must be in the same voice channel as I am in.");
        } 

        command.slashExecute(interaction, client);
    } catch (error) {
        console.log(error);
        return interaction.reply(`Something went wrong trying to run your command! \n ${error}`);
    }

}