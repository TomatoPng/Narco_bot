const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'supply',
    description: 'lists supply of certain group of supplies \nex: $supply drugs',
    execute(msg, args, utils) {
        const supplyArr = ["drugs", "arms", "locations"]
        if (!args[1]) {
            msg.channel.send("Please enter what suply you wish to see")
            return
        }
        var isGood = false
        for (let i = 0; i < supplyArr.length; i++) {
            if (args[1] === supplyArr[i]) isGood = true
        }
        if (!isGood) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData

                var embed = new MessageEmbed()
                    .setTitle(msg.author.username + ' ' + args[1] + ' supply list')
                    .setDescription("")
                    .setColor('#008925')
                    .setFooter('$help');

                args[1] = args[1].toLowerCase()
                switch (args[1]) {
                    case "drugs":
                        var upDrug
                        for (let i = 0; i < data1.userData.length; i++) {
                            if (data1.userData[i].id === msg.author.id) {
                                embed.addField("Zaza", "Ammount: " + data1.userData[i].assets.supply.drugs.Zaza.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Zaza.quality)
                                embed.addField("H", "Ammount: " + data1.userData[i].assets.supply.drugs.H.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.H.quality)
                                embed.addField("Coke", "Ammount: " + data1.userData[i].assets.supply.drugs.Coke.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Coke.quality)
                                embed.addField("Crystal", "Ammount: " + data1.userData[i].assets.supply.drugs.Crystal.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Crystal.quality)
                                embed.addField("Mystery pills", "Ammount: " + data1.userData[i].assets.supply.drugs.Mystery_pills.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Mystery_pills.quality)
                                embed.addField("Molly", "Ammount: " + data1.userData[i].assets.supply.drugs.Molly.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Molly.quality)
                            }
                        }
                        break
                    case "arms":
                        for (let i = 0; i < data1.userData.length; i++) {
                            if (data1.userData[i].id === msg.author.id) {
                                embed.addField("AR", "Ammount: " + data1.userData[i].assets.supply.arms.AR.amm + "\nQuality: " + data1.userData[i].assets.supply.arms.AR.quality)
                                embed.addField("Handgun", "Ammount: " + data1.userData[i].assets.supply.arms.Handgun.amm + "\nQuality: " + data1.userData[i].assets.supply.arms.Handgun.quality)
                                embed.addField("Explosive", "Ammount: " + data1.userData[i].assets.supply.arms.Explosive.amm + "\nQuality: " + data1.userData[i].assets.supply.arms.Explosive.quality)
                                embed.addField("Lethal service", "Ammount: " + data1.userData[i].assets.supply.arms.Lethal_service.amm + "\nQuality: " + data1.userData[i].assets.supply.arms.Lethal_service.quality)
                            }
                        }
                        break
                    case "locations":
                        for (let i = 0; i < data1.userData.length; i++) {
                            if (data1.userData[i].id === msg.author.id) {
                                embed.addField("Lab", "Ammount: " + data1.userData[i].assets.supply.locations.Lab.amm + "\nQuality: " + data1.userData[i].assets.supply.locations.Lab.quality)
                                embed.addField("Cover store", "Ammount: " + data1.userData[i].assets.supply.locations.Cover_store.amm + "\nQuality: " + data1.userData[i].assets.supply.locations.Cover_store.quality)
                                embed.addField("Farm", "Ammount: " + data1.userData[i].assets.supply.locations.Farm.amm + "\nQuality: " + data1.userData[i].assets.supply.locations.Farm.quality)
                                embed.addField("Pharmacy", "Ammount: " + data1.userData[i].assets.supply.locations.Pharmacy.amm + "\nQuality: " + data1.userData[i].assets.supply.locations.Pharmacy.quality)
                            }
                        }
                        break
                }

                msg.channel.send(embed)
            })
            .catch(err => {
                console.error(err)
            })
    },
};