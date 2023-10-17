const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'restock',
    description: 'Allows you to restock facilities that sell product\nex: $restock cover store 20 4\nex: $restock pharmacy 20 1',
    execute(msg, args, utils) {
        if (!args[1]) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        } else if (!args[2]) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        } else if (!args[3]) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        var facId
        if (isNaN(parseInt(args[2]))) {
            if (args[1].toLowerCase() === "cover") {
                facId = parseInt(args[3])
                if (!args[4]) {
                    msg.channel.send("Please enter correct parameters, if confused use $help")
                    return
                }
            } else {
                msg.channel.send("Please enter correct parameters, if confused use $help")
                return
            }
        } else {
            facId = parseInt(args[2])
        }
        var pm
        if (args[1].toLowerCase() === "cover") pm = parseInt(args[4]); else pm = parseInt(args[3])
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData
                for (let i = 0; i < serverData.userData.length; i++) {
                    if (serverData.userData[i].id === msg.author.id) {
                        for (let j = 0; j < serverData.userData[i].assets.facilities.length; j++) {
                            if (serverData.userData[i].assets.facilities[j].id === facId) {
                                if ((serverData.userData[i].money.bank * pm) < (serverData.userData[i].assets.facilities[j].supplyCost * pm)) {
                                    msg.channel.send("You do not have the funds in your bank to restock this facility")
                                    return
                                }
                                switch (data1.userData[i].assets.facilities[j].product.type) {
                                    case "drugs":
                                        data1.userData[i].assets.facilities[j].product.amm = ((parseInt(data1.userData[i].assets.facilities[j].product.amm) + 250) * pm).toString() + " oz"
                                        break
                                    case "arms":
                                        data1.userData[i].assets.facilities[j].product.amm += (250 * pm)
                                        break
                                }
                                data1.userData[i].money.bank = data1.userData[i].money.bank - (data1.userData[i].assets.facilities[j].supplyCost * pm)
                                var embed = new MessageEmbed()
                                    .setTitle('Facility list #' + data1.userData[i].assets.facilities[j].id)
                                    .setDescription("")
                                    .setColor('#008925')
                                    .setFooter(data1.userData[i].assets.facilities[j].id);
                                embed.addField("Product", "Ammount: " + data1.userData[i].assets.facilities[j].product.amm + "\nQuality: " + data1.userData[i].assets.facilities[j].product.quality + "\nPrice: " + data1.userData[i].assets.facilities[j].supplyCost)
                                msg.channel.send("Successfully restocked " + data1.userData[i].assets.facilities[j].type + " number " + data1.userData[i].assets.facilities[j].id)
                                msg.channel.send(embed)
                            }
                        }
                    }
                }
                utils.send(data1)
                    .then(res => {
                    })
                    .catch(err => console.error(err))
            })
            .catch(err => console.error(err))
    },
};
