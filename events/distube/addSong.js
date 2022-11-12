const { Queue, Song } = require("distube");
const addSongEmbed = require("../../functions/addSongEmbed");

/**
 * 
 * @param { Queue } queue 
 * @param { Song } song 
 */
module.exports = async (queue, song) => {
    song.description = "(Unavailable for now.)";

    queue.textChannel.send({
        embeds: [
            addSongEmbed(song.name, song.description, song.duration, song.thumbnail, song.user)
        ]
    });

    return;

    function youtubeParser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
}