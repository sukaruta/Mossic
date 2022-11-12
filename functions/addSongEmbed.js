const { EmbedBuilder, Colors, User } = require("discord.js");
const humanizeDuration = require("humanize-duration");
/**
 * 
 * @param { string } songTitle 
 * @param { string } songDescription 
 * @param { Date } songPlayedAt 
 * @param { number } songDurationInSeconds 
 * @param { string } songThumbnail 
 * @param { User } songRequestedBy
 * @returns EmbedBuilder
 */
module.exports = (songTitle, songDescription, songDurationInSeconds, songThumbnail, songRequestedBy) => new EmbedBuilder()
    .setTitle(`Added song "${songTitle}" to the queue`)
    .setDescription(songDescription)
    .setThumbnail(songThumbnail)
    .addFields(
        { name: "Duration", value: `${humanizeDuration(songDurationInSeconds * 1000)}` }
    )
    .setColor(Colors.Blue)
    .setFooter({

        text: `Requested By: ${songRequestedBy.username}#${songRequestedBy.discriminator}`,
        iconURL: songRequestedBy.avatarURL({
            size: 32
         })
    })
