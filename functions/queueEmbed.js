const { EmbedBuilder, Colors, User, hyperlink } = require("discord.js");
const { Queue } = require("distube");
const humanizeDuration = require("humanize-duration");
/**
 * 
 * @param { Queue } queue
 * @param { User } user
 * @returns EmbedBuilder
 */
module.exports = (queue, user) => {
    let i = 1;
    let totalQueueDuration = 0;

    queue.songs.forEach(song => totalQueueDuration += song.duration); 

    return new EmbedBuilder()
    .setTitle(`🎵 Server Queue 📃`)
    .setDescription(queue.songs.map((song) => `${i++}. ${song.name}`).join(",\n"))
    .addFields(
        { name: "💿 Now Playing", value: `${queue.songs[0].name}`},
        { name: "⌚ Total Queue Duration", value: `${humanizeDuration(totalQueueDuration * 1000)}` }
    )
    .setColor(Colors.Blue)
    .setFooter({
        text: `Requested By: ${user.username}#${user.discriminator}`,
        iconURL: user.avatarURL({
            size: 32
         })
    })
}
