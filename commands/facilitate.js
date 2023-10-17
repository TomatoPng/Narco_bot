const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'facilitate',
    description: 'Turns a location of your choice into a location to help you produce or sell product\nex: $facilitate lab crystal\nex: $facilitate cover store handgun',
    execute(msg, args, utils, storage) {
        if (!args[1] || !args[2]) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        args[1] = args[1].toLowerCase()
        args[2] = args[2].toLowerCase()
        if (args[3]) args[3] = args[3].toLowerCase()
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData

                function facilitate(location, pos, args2) {
                    for (let i = 0; i < data1.userData.length; i++) {
                        if (msg.author.id === data1.userData[i].id) {
                            if (data1.userData[i].assets.supply.locations[location].amm >= 1) {
                                var facility = {
                                    type: location,
                                    id: data1.userData[i].assets.facilities.length,
                                    isSupplied: false
                                }
                                facility.narcType = pos
                                switch (args2) {
                                    case "lethal":
                                        facility.supplyType = "Lethal_service"
                                        break
                                    case "handgun":
                                        facility.supplyType = "Handgun"
                                        break
                                    case "ar":
                                        facility.supplyType = "AR"
                                        break
                                    case "explosive":
                                        facility.supplyType = "Explosive"
                                        break
                                    case "zaza":
                                        facility.supplyType = "Zaza"
                                        break
                                    case "crystal":
                                        facility.supplyType = "Crystal"
                                        break
                                    case "coke":
                                        facility.supplyType = "Coke"
                                        break
                                    case "molly":
                                        facility.supplyType = "Molly"
                                        break
                                    case "h":
                                        facility.supplyType = "H"
                                        break
                                    case "mystery":
                                        facility.supplyType = "Mystery_pills"
                                        break
                                    default:
                                        msg.channel.send("Please enter correct parameters, if confused use $help")
                                        return
                                }
                                var qps
                                if (args2 === "crystal" || args2 === "zaza" || args2 === "coke" || args2 === "mystery" || args2 === "molly" || args2 === "h") {
                                    facility.product = {
                                        amm: "0 oz",
                                        quality: data1.userData[i].assets.supply.locations[location].quality,
                                        type: "drugs"
                                    }
                                    qps = (facility.product.quality * 1.9).toString() + " oz"
                                } else if (args2 === "handgun" || args2 === "lethal" || args2 === "ar" || args2 === "explosive") {
                                    facility.product = {
                                        amm: 0,
                                        quality: data1.userData[i].assets.supply.locations[location].quality,
                                        type: "arms"
                                    }
                                    qps = (facility.product.quality * 1.9).toString()
                                } else {
                                    msg.channel.send("Please enter correct parameters, if confused use $help")
                                    return
                                }
                                var supplyCost = ((10000 + (100000 - 10000) * (data1.userData[i].assets.supply.locations[location].quality / 200)) * 0.9)
                                var productCost = ((10000 + (100000 - 10000) * (facility.product.quality / 200)))
                                facility.supplyCost = supplyCost
                                if (!storage[msg.author.username]) {
                                    storage[msg.author.username] = {}
                                }
                                facility.productCost = productCost
                                facility.qps = qps
                                facility.produceInterval = (Math.round(200 - data1.userData[i].assets.supply.locations[location].quality))
                                storage[msg.author.username].currentFacility = facility

                                var embed = new MessageEmbed()
                                    .setTitle(msg.author.username + ' Facility contract')
                                    .setDescription("")
                                    .setColor('#008925')
                                    .setFooter('All stats on this facility are relative to the initial quality of the location');
                                embed.addField("Supply cost", "$" + supplyCost.toString() + "\nThis will be the inital cost to start production or selling")
                                embed.addField("Product", facility.supplyType)
                                embed.addField("Info", "Efficiency: this facility will sell/produce product every " + (Math.round(200 - data1.userData[i].assets.supply.locations[location].quality)) + " mins \nQuanity Per: this facility will produce/sell " + qps + " per sale/production \nCost: this facilities product will cost $" + ((10000 + (100000 - 10000) * (facility.product.quality / 200))).toString() + "\nFacility Type: this facility is a " + facility.narcType + " facility")
                                embed.addField("Choose", "If you would like to make this location a facility respond with 'sign'")

                                msg.channel.send(embed)
                            } else {
                                msg.channel.send("You do not have a location to facilitate")
                                return
                            }
                        }
                    }
                }

                switch (args[1]) {
                    case "lab":
                        facilitate("Lab", "produce", args[2])
                        break
                    case "cover":
                        facilitate("Cover_store", "seller", args[3])
                        break
                    case "pharmacy":
                        facilitate("Pharmacy", "seller", args[2])
                        break
                    case "farm":
                        facilitate("Farm", "produce", args[2])
                        break
                    default:
                        msg.channel.send("Please enter correct paramters, if confused use $help")
                        return
                }
            })
            .catch(err => {
                console.error(err)
            })
    },
};