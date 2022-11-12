const promiseErrorEmbed = require("../../functions/promiseErrorEmbed");

module.exports = (guildChannel, error) => {
    console.log(error);
    guildChannel.send({
        embeds: [promiseErrorEmbed(-4039, error.stack, error.name, error.message)]
    });
}