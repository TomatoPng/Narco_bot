const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'facilities',
    description: 'Lists a specified facility\nex: $facilities 14',
    execute(msg, args, utils) {
        if (!args[1] || isNaN(parseInt(args[1]))) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        var embed = new MessageEmbed()
            .setTitle('Facility list #' + args[1])
            .setDescription("")
            .setColor('#008925')
            .setFooter(args[1]);
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData
                for (let i = 0; i < serverData.userData.length; i++) {
                    if (serverData.userData[i].id === msg.author.id) {
                        for (let j = 0; j < serverData.userData[i].assets.facilities.length; j++) {
                            if (serverData.userData[i].assets.facilities[j].id === parseInt(args[1])) {
                                const facility = data1.userData[i].assets.facilities[j]
                                embed.addField("Product", "Ammount: " + facility.product.amm + "\nQuality: " + facility.product.quality + "\nPrice: " + facility.supplyCost)
                                embed.addField("Info", "Sell/Produce interval: this facility sells product every " + facility.produceInterval + "\nQuanity per sale: this facility sells " + facility.qps + " per sale \nType: " + facility.narcType)
                                embed.addField("Location", facility.type)
                                msg.channel.send(embed)
                            }
                        }
                    }
                }
            })
            .catch(err => console.error(err))
    },
};
