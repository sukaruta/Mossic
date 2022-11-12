const { EmbedBuilder, Colors } = require("discord.js");

module.exports = (message, query) => {
    message.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("Could not find results for search query.")
                .setDescription(`Your search query for \`${query}\` turned no results.`)
                .setColor(Colors.DarkRed)
        ]
    });

    return;
}