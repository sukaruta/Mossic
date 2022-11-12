const { EmbedBuilder, User } = require("discord.js");
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
module.exports = (songTitle, songDescription, songCurrentTime, songDurationInSeconds, songThumbnail, songRequestedBy) => new EmbedBuilder()
    .setTitle(`Now Playing "${songTitle}"`)
    .setDescription(songDescription)
    .setThumbnail(songThumbnail)
    .addFields(
        { name: "Duration", value: `${humanizeDuration(songCurrentTime * 1000, { round: true })} / ${humanizeDuration(songDurationInSeconds * 1000)}` }
    )
    .setColor("Random")
    .setFooter({

        text: `Requested By: ${songRequestedBy.username}#${songRequestedBy.discriminator}`,
        iconURL: songRequestedBy.avatarURL({
            size: 32
         })
    })
