const { EmbedBuilder, Colors } = require("discord.js");
const { Queue, Playlist } = require("distube");
const humanizeDuration = require("humanize-duration");

/**
 * 
 * @param { Queue } queue 
 * @param { Playlist } playlist 
 */
module.exports = (queue, playlist) => {
    let i = 1;
    let playListDuration = 0;
    let queueDuration = 0;

    playlist.songs.forEach(song => playListDuration += song.duration);
    queue.songs.forEach(song => queueDuration += song.duration);

    queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`💿 Playlist "${playlist.name}" added to song queue.`)
                .setDescription(`${playlist.songs.map((song) => `${i++}. ${song.name}`).join(",\n")}`)
                .setColor(playlist.source === "youtube" ? Colors.Red : Colors.Green)
                .addFields(
                    { name: "Playlist Duration", value: humanizeDuration(playListDuration * 1000) },
                    { name: "Total Queue Duration", value: humanizeDuration(queueDuration * 1000) }
                )
        ]
    });
}