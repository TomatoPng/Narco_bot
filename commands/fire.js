const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'fire',
    description: 'get rid of a dealer\nex: $fire diego',
    execute(msg, args, utils, storage) {
        if (!args[1]) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        args[1] = args[1].toLowerCase()
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData
                for (let i = 0; i < data1.userData.length; i++) {
                    if (msg.author.id === data1.userData[i].id) {
                        for (let j = 0; j < data1.userData[i].assets.dealers.length; j++) {
                            if (data1.userData[i].assets.dealers[j].name.toLowerCase() === args[1]) {
                                clearInterval(storage[msg.author.username].dealers[serverData.userData[i].assets.dealers[j].name].payInterval)
                                clearInterval(storage[msg.author.username].dealers[serverData.userData[i].assets.dealers[j].name].sellInterval)
                                const name = serverData.userData[i].assets.dealers[j].name
                                data1.userData[i].assets.dealers.splice(data1.userData[i].assets.dealers.indexOf(data1.userData[i].assets.dealers[j]), 1)
                                utils.send(data1)
                                    .then(res => {
                                        msg.channel.send("Successfully fired " + name)

                                        var embed = new MessageEmbed()
                                            .setTitle(msg.author.username + ' Dealers list')
                                            .setDescription("")
                                            .setColor('#008925')
                                            .setFooter('$help');

                                        for (let k = 0; k < data1.userData[i].assets.dealers.length; k++) {
                                            embed.addField(data1.userData[i].assets.dealers[k].name, "Type: " + data1.userData[i].assets.dealers[k].type + "\nStats: \n\tEfficiency: " + data1.userData[i].assets.dealers[k].stats.efficiency + "\n\tSupply: " + data1.userData[i].assets.dealers[k].stats.supply + "\n\tPitching: " + data1.userData[i].assets.dealers[k].stats.pitching + "\nProduct: " + data1.userData[i].assets.dealers[k].product + "\nPay: " + data1.userData[i].assets.dealers[k].hirePrice)
                                        }

                                        msg.channel.send(embed)
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                            }
                        }
                    }
                }
            })
    },
};
