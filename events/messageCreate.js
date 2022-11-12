const { Client, Message, Collection } = require("discord.js");

const prefix = process.env.PREFIX;

/**
 * 
 * @param { Client } client 
 * @param { Message } message 
 */
module.exports = async (client, message) => {
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    const args = message.content.substring(prefix.length).split(" ");
    const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

    if (!command) return;

    if (!client.cooldowns.has(command.data.name)) client.cooldowns.set(command.data.name, new Collection());

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationDate = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationDate) {
            const timeLeft = (expirationDate - now) / 1000;
            var sec = 'seconds';
            if (timeLeft.toFixed(1) <= 1.0) sec = 'second';
            
            return message.reply(`Please wait ${timeLeft.toFixed(1)} ${sec} before reusing this command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        if (command.isPrivate && message.author.id !== '316779865380618242') return;

        if (command.inSameVoiceChannel) {
            const { channel: voiceChannel } = message.member.voice;
            if (!voiceChannel) return message.reply("You are not in a voice channel!");

            const me = await message.guild.members.fetchMe();
            
            if (me.voice.channel && voiceChannel.id !== me.voice.channel.id && me.voice.channel.members.size !== 1) 
            return message.reply("You must be in the same voice channel as I am in.");
        } 

        command.textExecute(message, args, client);
    } catch (error) {
        console.log(error);
        return message.reply(`Something went wrong trying to run your command! \n ${error}`);
    }

}