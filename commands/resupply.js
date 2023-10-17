const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'resupply',
    description: 'resupply your hired dealers with your product\nex: $resupply all - (will resupply all dealers)\nex: $resupply diego - (will resupply specific dealer with name)',
    execute(msg, args, utils) {
        if (!args[1]) {
            msg.channel.send("Please enter who you want to resupply, if you want to resupply all enter 'all'")
            return
        }
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData
                for (let i = 0; i < serverData.userData.length; i++) {
                    if (serverData.userData[i].id === msg.author.id) {
                        for (let j = 0; j < serverData.userData[i].assets.dealers.length; j++) {
                            function sendEmbed() {
                                utils.send(data1)
                                    .then(res => {
                                        var embed = new MessageEmbed()
                                            .setTitle(msg.author.username + ' ' + data1.userData[i].assets.dealers[j].type + ' supply list')
                                            .setDescription("")
                                            .setColor('#008925')
                                            .setFooter('$help');

                                        switch (data1.userData[i].assets.dealers[j].type) {
                                            case "drug":
                                                for (let i = 0; i < data1.userData.length; i++) {
                                                    if (data1.userData[i].id === msg.author.id) {
                                                        embed.addField("Zaza", "Ammount: " + data1.userData[i].assets.supply.drugs.Zaza.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Zaza.quality)
                                                        embed.addField("H", "Ammount: " + data1.userData[i].assets.supply.drugs.H.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.H.quality)
                                                        embed.addField("Coke", "Ammount: " + data1.userData[i].assets.supply.drugs.Coke.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Coke.quality)
                                                        embed.addField("Crystal", "Ammount: " + data1.userData[i].assets.supply.drugs.Crystal.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Crystal.quality)
                                                        embed.addField("Molly", "Ammount: " + data1.userData[i].assets.supply.drugs.Mystery_pills.amm + "\nQuality: " + data1.userData[i].assets.supply.drugs.Mystery_pills.quality)
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
                            }
                            if (args[1] !== "all") {
                                if (serverData.userData[i].assets.dealers[j].name.toLowerCase() === args[1].toLowerCase()) {
                                    var dealerType = data1.userData[i].assets.dealers[j].type
                                    if (dealerType === "drug") dealerType = "drugs"; else if (dealerType === "location") dealerType = "locations"
                                    var dealerProduct = data1.userData[i].assets.dealers[j].product
                                    if (dealerProduct === "Cover Store") dealerProduct = "Cover_store"; else if (dealerProduct === "Lethal Service") dealerProduct = "Lethal_service"; else if (dealerProduct === "Mystery Pills") dealerProduct = "Mystery_pills"
                                    if (dealerType === "drugs") {
                                        dealerProduct = dealerProduct.split(' of ')[1]
                                        if (dealerProduct === "Mystery Pills") {
                                            dealerProduct = "Mystery_pills"
                                        }
                                        if (parseInt(data1.userData[i].assets.supply[dealerType][dealerProduct].amm) < (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)) {
                                            msg.channel.send("You are unable to resupply " + data1.userData[i].assets.dealers[j].name + " due to low supply")
                                            return
                                        }
                                        data1.userData[i].assets.dealers[j].supplyAmm += ((data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval).toString() + "oz")
                                        data1.userData[i].assets.supply.drugs[dealerProduct].amm = (parseInt(data1.userData[i].assets.supply.drugs[dealerProduct].amm) - (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)).toString() + " oz"
                                        data1.userData[i].assets.dealers[j].supplyQuality = data1.userData[i].assets.supply[dealerType][dealerProduct].quality
                                    } else {
                                        if (parseInt(data1.userData[i].assets.supply[dealerType][dealerProduct].amm) < (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)) {
                                            msg.channel.send("You are unable to resupply " + data1.userData[i].assets.dealers[j].name + " due to low supply")
                                            return
                                        }
                                        console.log(data1.userData[i].assets.dealers[j].supplyAmm)
                                        console.log(data1.userData[i].assets.dealers[j])
                                        data1.userData[i].assets.dealers[j].supplyAmm += (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)
                                        data1.userData[i].assets.supply[dealerType][dealerProduct].amm -= (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)
                                        data1.userData[i].assets.dealers[j].supplyQuality = data1.userData[i].assets.supply[dealerType][dealerProduct].quality
                                        console.log(data1.userData[i].assets.dealers[j].supplyAmm)
                                        console.log(data1.userData[i].assets.dealers[j])
                                    }
                                    msg.channel.send("successfully updated " + data1.userData[i].assets.dealers[j].name + "'s " + data1.userData[i].assets.dealers[j].product + " supply")
                                    sendEmbed()
                                }
                            } else {
                                var dealerType = data1.userData[i].assets.dealers[j].type
                                if (dealerType === "drug") dealerType = "drugs"
                                var dealerProduct = data1.userData[i].assets.dealers[j].product
                                if (dealerProduct === "Cover Store") dealerProduct = "Cover_store"; else if (dealerProduct === "Lethal Service") dealerProduct = "Lethal_service"; else if (dealerProduct === "Mystery Pills") dealerProduct = "Mystery_pills"
                                if (dealerType === "drugs") {
                                    if (parseInt(data1.userData[i].assets.supply[dealerType][dealerProduct].amm) < (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)) {
                                        data1.userData[i].notifications.push("You are unable to resupply " + data1.userData[i].assets.dealers[j].name + " due to low supply")
                                        return
                                    }
                                    data1.userData[i].assets.dealers[j].supplyAmm += (((data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)).toString() + "oz")
                                    data1.userData[i].assets.supply.drugs[dealerProduct].amm -= (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)
                                } else {
                                    if (parseInt(data1.userData[i].assets.supply[dealerType][dealerProduct].amm) < (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)) {
                                        data1.userData[i].notifications.push("You are unable to resupply " + data1.userData[i].assets.dealers[j].name + " due to low supply")
                                        return
                                    }
                                    data1.userData[i].assets.dealers[j].supplyAmm += (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)
                                    data1.userData[i].assets.supply.drugs[dealerProduct].amm -= (data1.userData[i].assets.dealers[j].stats.supply * data1.userData[i].assets.dealers[j].supplyInterval)
                                }
                                data1.userData[i].notifications.push("successfully updated " + data1.userData[i].assets.dealers[j].name + "'s " + data1.userData[i].assets.dealers[j].product + " supply")
                                sendEmbed()
                            }
                        }
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    },
};
