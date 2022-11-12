const { EmbedBuilder, Colors } = require("discord.js")

module.exports = (error, additionalDescription = null) => {
    if (error.errorCode) {
        let disTubeErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setFooter({
                text: `Error recorded @${new Date()}`
            });

        if (additionalDescription) disTubeErrorEmbed.setDescription(additionalDescription);

        switch (error.errorCode) {
            case "VOICE_MISSING_PERMS":
                return disTubeErrorEmbed
                    .setTitle("❌ Not enough permissions!")
                    .setDescription("I do not have enough permissions to join this voice channel.");
            case "NO_QUEUE":
                return disTubeErrorEmbed
                    .setTitle("❌ This server currently has no active queue");
            case "PAUSED":
                return disTubeErrorEmbed
                    .setTitle("The queue has already been paused.")
                    .setColor(Colors.Blue);
            case "NO_PREVIOUS":
                return disTubeErrorEmbed
                    .setTitle("❌ There is no previous song available to skip to.");
            case "RESUMED":
                return disTubeErrorEmbed
                    .setTitle("The queue is currently resumed.")
                    .setColor(Colors.Blue);
            case "NO_SONG_POSITION":
                return disTubeErrorEmbed
                    .setTitle("❌ The song position you requested for does not exist.");
            case "NO_UP_NEXT":
                return disTubeErrorEmbed
                    .setTitle("❌ No song coming up next.");
            default:
                return disTubeErrorEmbed
                    .setColor(Colors.DarkRed)
                    .setTitle("❌ Undocumented Error Found")
                    .addFields(
                        { name: "ERRNAME", value: `${error.errorCode}` }
                    )
        }
    }

    return new EmbedBuilder()
        .setTitle("❌ An unknown error occured!")
        .setDescription(error)
        .setColor(Colors.DarkRed)
        .setFooter({
            text: `Error recorded @${new Date()}`
        });
}