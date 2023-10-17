const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'dealers',
    description: 'gives info on all your dealers',
    execute(msg, args, utils) {
        utils.recieve()
            .then(res => {
                const serverData = res.data

                var embed = new MessageEmbed()
                    .setTitle(msg.author.username + ' Dealers list')
                    .setDescription("")
                    .setColor('#008925')
                    .setFooter('$help');

                for (let i = 0; i < serverData.userData.length; i++) {
                    if (serverData.userData[i].id === msg.author.id) {
                        for (let j = 0; j < serverData.userData[i].assets.dealers.length; j++) {
                            embed.addField(serverData.userData[i].assets.dealers[j].name, "Type: " + serverData.userData[i].assets.dealers[j].type + "\nStats: \n\tEfficiency: " + serverData.userData[i].assets.dealers[j].stats.efficiency + "\n\tSupply: " + serverData.userData[i].assets.dealers[j].stats.supply + "\n\tPitching: " + serverData.userData[i].assets.dealers[j].stats.pitching + "\nProduct: " + serverData.userData[i].assets.dealers[j].product + "\nPay: " + serverData.userData[i].assets.dealers[j].hirePrice)
                        }
                    }
                }

                msg.channel.send(embed)
            })
            .catch(err => {
                console.error(err)
            })
    },
};
