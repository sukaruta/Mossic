const { Song, Queue } = require("distube");
const nowPlayingEmbed = require("../../functions/nowPlayingEmbed");

/**
 * 
 * @param { Queue } queue 
 * @param { Song } song 
 */
module.exports = async (queue, song) => {
    song.playedOn = new Date();

    song.description = "(Unavailable for now.)";

    if (song.description.length >= 200) song.description = song.description.substring(0, 200) + "...";

    queue.textChannel.send({
        embeds: [
            nowPlayingEmbed(song.name, song.description, queue.currentTime, song.duration, song.thumbnail, song.user, song.liveDuration)
        ]
    })

    return;

    function youtubeParser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
}