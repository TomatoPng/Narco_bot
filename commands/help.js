const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
    name: 'help',
    description: 'List commands for help',
    execute(msg, args, utils) {

        const commandFiles = fs.readdirSync(path.join(__dirname, '')).filter(file => file.endsWith('.js'));

        var embed = new Discord.MessageEmbed()
            .setTitle('Narco Command Help')
            .setDescription("")
            .setColor('#008925')
            .setFooter('$help');

        for (const [name, command] of msg.client.coms) {
            if (command.name !== "args") {
                embed.addField("$" + command.name, command.description)
            }
        }

        switch (args[1]) {
            default:
                msg.channel.send(embed)
                break
        }

    },
};
