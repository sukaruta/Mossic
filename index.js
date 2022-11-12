require("dotenv").config();

const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});
client.commands = new Collection();
client.cooldowns = new Collection();

client.distube = new DisTube(client, {
    searchSongs: 1,
    leaveOnStop: false,
    emptyCooldown: 120,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    savePreviousSongs: true,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
            api: {
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET
            }
        })
    ],
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }

    fs.readdir('./events/', (err, files) => {
        if (err) return console.log(err);

        files.forEach(file => {
            if (!file.endsWith('.js')) return;

            const event = require(`./events/${file}`);
            const eventName = file.split('.')[0];

            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });

    fs.readdir('./events/distube', (err, files) => {
        if (err) return console.log(err);

        files.forEach(file => {
            if (!file.endsWith('.js')) return;

            const event = require(`./events/distube/${file}`);
            if (typeof event !== "function") return;
            const eventName = file.split('.')[0];

            client.distube.on(eventName, event);
            delete require.cache[require.resolve(`./events/distube/${file}`)];
        });
    });

client.login(process.env.TOKEN);





