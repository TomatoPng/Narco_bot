const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
    name: 'help',
    description: 'List dev commands for help',
    execute(msg, args, utils) {

        const commandFiles = fs.readdirSync(path.join(__dirname, '')).filter(file => file.endsWith('.js'));

        var embed = new Discord.MessageEmbed()
            .setTitle('Narco Dev Command Help')
            .setDescription("")
            .setColor('#11008F')
            .setFooter('d$help');

        for (const [name, command] of msg.client.dev) {
            embed.addField("d$" + command.name, command.description)
        }

        switch (args[1]) {
            default:
                msg.channel.send(embed)
                break
        }

    },
};
