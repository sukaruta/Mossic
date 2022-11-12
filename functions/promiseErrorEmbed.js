const { EmbedBuilder, Colors } = require("discord.js")

module.exports = (errorNum, code, errName, reason) => {
    return new EmbedBuilder()
        .setTitle("An Error has occured! ⚠️")
        .addFields(
            { name: "FATAL", value: "true" },
            { name: "ERRNUM", value: `${errorNum}` },
            { name: "ERRCODE", value: `${code}` },
            { name: "ERRNAME", value: `${errName}` },
            { name: "reason", value: `${reason}` }
            )
        .setColor(Colors.DarkRed)
        .setFooter({
            text: `Error Recorded @${new Date()}`
        });
}