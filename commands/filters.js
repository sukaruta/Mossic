const { SlashCommandBuilder, Message, Client, Embed, EmbedBuilder, Colors, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("filters")
        .setDescription("Modifies the song filters to be used for the current existing queue.")
        .addSubcommandGroup((subcommandGroup) => 
            subcommandGroup
            .setName("modifiers")
            .setDescription("Select what action to do with the list of queue filters.")
            .addSubcommand((subCommand) => 
                subCommand
                .setName("add")
                .setDescription("Add a filter to the song queue.")
                .addStringOption((stringOption) => 
                    stringOption
                    .setName("filter")
                    .setDescription("The filter to add.")
                    .addChoices(
                        { name: "Echo", value: "echo" },
                        { name: "Flanger", value: "flanger" },
                        { name: "Gate", value: "gate" },
                        { name: "Haas", value: "haas" },
                        { name: "Karaoke", value: "karaoke" },
                        { name: "Nightcore", value: "nightcore" },
                        { name: "Reverse", value: "reverse" },
                        { name: "Vaporwave", value: "vaporwave" },
                        { name: "Mcompand", value: "mcompand" },
                        { name: "Phaser", value: "phaser" },
                        { name: "Tremolo", value: "tremolo" },
                        { name: "Surroud", value: "surround" },
                        { name: "Earwax", value: "earwax" }
                    )
                .setRequired(false)
        )
            )
            .addSubcommand((subCommand) => 
                subCommand
                .setName("remove")
                .setDescription("Remove a filter from the song queue")
                .addStringOption((stringOption) => 
                    stringOption
                    .setName("filter")
                    .setDescription("The filter to remove")
                    .addChoices(
                        { name: "Echo", value: "echo" },
                        { name: "Flanger", value: "flanger" },
                        { name: "Gate", value: "gate" },
                        { name: "Haas", value: "haas" },
                        { name: "Karaoke", value: "karaoke" },
                        { name: "Nightcore", value: "nightcore" },
                        { name: "Reverse", value: "reverse" },
                        { name: "Vaporwave", value: "vaporwave" },
                        { name: "Mcompand", value: "mcompand" },
                        { name: "Phaser", value: "phaser" },
                        { name: "Tremolo", value: "tremolo" },
                        { name: "Surroud", value: "surround" },
                        { name: "Earwax", value: "earwax" }
                    )
                    .setRequired(false)
                )
            )
            .addSubcommand((subCommand) =>
            subCommand
            .setName("getvalue")
            .setDescription("Shows all activated song queue activated filters.")
            )
        ),

    cooldown: 5,
    inSameVoiceChannel: true,
    /**
     * 
     * @param { Message } message 
     * @param { String[] } args 
     * @param { Client } client 
     */
    async textExecute(message, args, client) {
        const guildQueue = client.distube.getQueue(message.guild.id);
        if (!guildQueue) return message.reply("This server does not have an active playing queue.");

        if (args[1]) {
            switch (args[1].toLowerCase()) {
                case "add":
                    addFilterToQueue(args[2]);
                    break;
                case "remove":
                    removeFilterFromQueue(args[2]);
                    break;
                default:
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("💿📃 Active audio filters for this queue")
                                .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                                .setColor(Colors.Orange)
                        ]
                    });
            }
        } else return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("💿📃 Active audio filters for this queue")
                    .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                    .setColor(Colors.Orange)
            ]
        });


        function addFilterToQueue(filter) {
            if(!Object.keys(client.distube.filters).includes(filter)) return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ You have provided an invalid filter.")
                        .setDescription(`Available filters: \`${Object.keys(client.distube.filters).map(filter => `\`${filter}\``).join(",\n")}\``)
                        .setColor(Colors.Red)
                ]
            })

            if (!guildQueue.filters.has(filter)) guildQueue.filters.add(filter);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("💿📃 Filters list updated")
                        .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                        .setColor(Colors.Green)
                ]
            });
        }

        function removeFilterFromQueue(filter) {
            if(!Object.keys(client.distube.filters).includes(filter)) return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ You have provided an invalid filter.")
                        .setDescription(`Available filters: \`${Object.keys(client.distube.filters).map(filter => `\`${filter}\``).join(",\n")}\``)
                        .setColor(Colors.Red)
                ]
            })

            if (guildQueue.filters.has(filter)) guildQueue.filters.remove(filter);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("💿📃 Filters list updated")
                        .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                        .setColor(Colors.Green)
                ]
            });
        }
    },

    /**
     * 
     * @param { Client } client 
     * @param { CommandInteraction } interaction 
     */
    async slashExecute(interaction, client) {
        const guildQueue = client.distube.getQueue(interaction.guild.id);
        if (!guildQueue) return interaction.reply("This server does not have an active playing queue.");

        let { name: subCommandName, options } = interaction.options.data[0];
        let interactionOption = interaction.options.getString("filter", false);

        if (subCommandName === "modifiers") {
            switch (options[0].name) {
                case "add":
                    addFilterToQueue(interactionOption);
                    break;
                case "remove":
                    removeFilterFromQueue(interactionOption);
                    break;
                default:
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("💿📃 Active audio filters for this queue")
                                .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n") || "`off`"}`)
                                .setColor(Colors.Orange)
                        ]
                    });
            }
        } else return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("💿📃 Active audio filters for this queue")
                    .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                    .setColor(Colors.Orange)
            ]
        });


        function addFilterToQueue(filter) {
            if(!Object.keys(client.distube.filters).includes(filter)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ You have provided an invalid filter.")
                        .setDescription(`Available filters: \`${Object.keys(client.distube.filters).map(filter => `\`${filter}\``).join(",\n")}\``)
                        .setColor(Colors.Red)
                ]
            })

            if (!guildQueue.filters.has(filter)) guildQueue.filters.add(filter);

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("💿📃 Filters list updated")
                        .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                        .setColor(Colors.Green)
                ]
            });
        }

        function removeFilterFromQueue(filter) {
            if(!Object.keys(client.distube.filters).includes(filter)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ You have provided an invalid filter.")
                        .setDescription(`Available filters: \`${Object.keys(client.distube.filters).map(filter => `\`${filter}\``).join(",\n")}\``)
                        .setColor(Colors.Red)
                ]
            })

            if (guildQueue.filters.has(filter)) guildQueue.filters.remove(filter);

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("💿📃 Filters list updated")
                        .setDescription(`${guildQueue.filters.names.map(filter => `\`${filter}\``).join(",\n")}`)
                        .setColor(Colors.Green)
                ]
            });
        }
    }
    
}