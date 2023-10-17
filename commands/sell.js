const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'sell',
    description: 'sell an item from your assets\nex: $sell lethal service 4\nex: $sell zaza 10oz',
    execute(msg, args, utils, storage) {
        if (!args[1] || !args[2]) {
            msg.channel.send("Please enter all parameters, if confused use $help")
            return
        }
        if (isNaN(parseInt(args[2])) && isNaN(parseInt(args[3]))) {
            msg.channel.send("Please enter parameters correctly, if confused use $help")
            return
        }
        function sell(category, item, ammount) {
            utils.recieve()
                .then(res => {
                    const serverData = res.data
                    var data1 = serverData
                    var sellPrice
                    for (let i = 0; i < data1.userData.length; i++) {
                        if (data1.userData[i].id === msg.author.id) {
                            const prevItemAmm = serverData.userData[i].assets.supply[category][item].amm
                            switch (category) {
                                case "drugs":
                                    sellPrice = 10 + (2500 - 10) * (data1.userData[i].assets.supply.drugs[item].quality / 200)
                                    var ammType = ""
                                    for (let j = 0; j < ammount.split('').length; j++) {
                                        if (isNaN(parseInt(ammount.split('')[j]))) {
                                            ammType = ammType + ammount.split('')[j]
                                        }
                                    }
                                    if (ammType === "") {
                                        msg.channel.send("Please enter proper parameters, if confused use $help")
                                        return
                                    }
                                    switch (ammType) {
                                        case "oz":
                                            if (parseInt(data1.userData[i].assets.supply.drugs[item].amm) < parseInt(ammount)) {
                                                msg.channel.send("You do not have the supply to sell this ammount of " + item)
                                                return
                                            }
                                            data1.userData[i].assets.supply.drugs[item].amm = (parseInt(data1.userData[i].assets.supply.drugs[item].amm) - parseInt(ammount)).toString() + " oz"
                                            data1.userData[i].money.wallet += sellPrice * parseInt(ammount)
                                            utils.send(data1)
                                                .then(res => {
                                                    msg.channel.send("Sold " + ammount + " of " + item.toLowerCase() + " for $" + (sellPrice * parseInt(ammount)).toString())
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                })
                                            break
                                        case "lb":
                                            if (parseInt(data1.userData[i].assets.supply.drugs[item].amm) < (parseInt(ammount) * 16)) {
                                                msg.channel.send("You do not have the supply to sell this ammount of " + item)
                                                return
                                            }
                                            data1.userData[i].assets.supply.drugs[item].amm = (parseInt(data1.userData[i].assets.supply.drugs[item].amm) - (parseInt(ammount) * 16)).toString() + " oz"
                                            data1.userData[i].money.wallet += sellPrice * (parseInt(ammount) * 16)
                                            utils.send(data1)
                                                .then(res => {
                                                    msg.channel.send("Sold " + ammount + " of " + item.toLowerCase() + " for $" + (sellPrice * parseInt(ammount)).toString())
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                })
                                            break
                                    }
                                    break
                                case "arms":
                                    sellPrice = 1000 + (10000 - 1000) * (data1.userData[i].assets.supply.arms[item].quality / 200)
                                    if (parseInt(data1.userData[i].assets.supply.arms[item].amm) < parseInt(ammount)) {
                                        msg.channel.send("You do not have the supply to sell this ammount of " + item)
                                        return
                                    }
                                    data1.userData[i].assets.supply.arms[item].amm = parseInt(data1.userData[i].assets.supply.arms[item].amm) - parseInt(ammount)
                                    data1.userData[i].money.wallet += sellPrice * parseInt(ammount)
                                    utils.send(data1)
                                        .then(res => {
                                            msg.channel.send("Sold " + ammount + " of " + item.toLowerCase() + " for $" + (sellPrice * parseInt(ammount)).toString())
                                        })
                                        .catch(err => {
                                            console.error(err)
                                        })
                                    break
                                case "locations":
                                    sellPrice = 10000 + (100000 - 10000) * (data1.userData[i].assets.supply.locations[item].quality / 200)
                                    if (parseInt(data1.userData[i].assets.supply.locations[item].amm) < parseInt(ammount)) {
                                        msg.channel.send("You do not have the supply to sell this ammount of " + item)
                                        return
                                    }
                                    data1.userData[i].assets.supply.locations[item].amm = parseInt(data1.userData[i].assets.supply.locations[item].amm) - parseInt(ammount)
                                    data1.userData[i].money.wallet += sellPrice * parseInt(ammount)
                                    utils.send(data1)
                                        .then(res => {
                                            msg.channel.send("Sold " + ammount + " of " + item.toLowerCase() + " for $" + (sellPrice * parseInt(ammount)).toString())
                                        })
                                        .catch(err => {
                                            console.error(err)
                                        })
                                    break
                            }

                            if (category === "drugs") {
                                var ammType = ""
                                for (let j = 0; j < ammount.split('').length; j++) {
                                    if (isNaN(parseInt(ammount.split('')[j]))) {
                                        ammType = ammType + ammount.split('')[j]
                                    }
                                }
                                switch (ammType) {
                                    case "oz":
                                        if (parseInt(prevItemAmm) === parseInt(args[2])) {
                                            data1.userData[i].assets.supply.drugs[item].quality = 0
                                        }
                                        break
                                    case "lb":
                                        if (parseInt(prevItemAmm) === (16 * parseInt(args[2]))) {
                                            data1.userData[i].assets.supply.drugs[item].quality = 0
                                        }
                                        break
                                }
                            } else {
                                if (parseInt(prevItemAmm) === parseInt(args[2])) {
                                    data1.userData[i].assets.supply[category][item].quality = 0
                                }
                            }
                            utils.send(data1)
                                .then()
                                .catch(err => console.error(err))

                            var embed = new MessageEmbed()
                                .setTitle(msg.author.username + ' Asset Inventory')
                                .setDescription("You have new supply!")
                                .setColor('#008925')
                                .setFooter('$help');

                            for (let i = 0; i < serverData.userData.length; i++) {
                                if (serverData.userData[i].id === msg.author.id) {
                                    embed.addField("Money", "Bank: $" + serverData.userData[i].money.bank.toString() + "\nWallet: $" + serverData.userData[i].money.wallet.toString())
                                }
                            }

                            var upDrug
                            for (let i = 0; i < data1.userData.length; i++) {
                                if (data1.userData[i].id === msg.author.id) {
                                    upDrug = "Zaza: " + data1.userData[i].assets.supply.drugs["Zaza"].amm + "\n"
                                    upDrug = upDrug + "H: " + data1.userData[i].assets.supply.drugs["H"].amm + "\n"
                                    upDrug = upDrug + "Coke: " + data1.userData[i].assets.supply.drugs["Coke"].amm + "\n"
                                    upDrug = upDrug + "Crystal: " + data1.userData[i].assets.supply.drugs["Crystal"].amm + "\n"
                                    upDrug = upDrug + "Molly: " + data1.userData[i].assets.supply.drugs["Molly"].amm + "\n"
                                    upDrug = upDrug + "Mystery Pills: " + data1.userData[i].assets.supply.drugs["Mystery_pills"].amm + "\n"
                                }
                            }
                            embed.addField("Drug supply", upDrug)

                            var upArms
                            for (let i = 0; i < data1.userData.length; i++) {
                                if (data1.userData[i].id === msg.author.id) {
                                    upArms = "AR: " + data1.userData[i].assets.supply.arms["AR"].amm + "\n"
                                    upArms = upArms + "Handgun: " + data1.userData[i].assets.supply.arms["Handgun"].amm + "\n"
                                    upArms = upArms + "Explosive: " + data1.userData[i].assets.supply.arms["Explosive"].amm + "\n"
                                    upArms = upArms + "Lethal Service: " + data1.userData[i].assets.supply.arms["Lethal_service"].amm + "\n"
                                }
                            }
                            embed.addField("Arms supply", upArms)

                            var upLoc
                            for (let i = 0; i < data1.userData.length; i++) {
                                if (data1.userData[i].id === msg.author.id) {
                                    upLoc = "Lab: " + data1.userData[i].assets.supply.locations["Lab"].amm + "\n"
                                    upLoc = upLoc + "Cover store: " + data1.userData[i].assets.supply.locations["Cover_store"].amm + "\n"
                                    upLoc = upLoc + "Farm: " + data1.userData[i].assets.supply.locations["Farm"].amm + "\n"
                                    upLoc = upLoc + "Pharmacy: " + data1.userData[i].assets.supply.locations["Pharmacy"].amm + "\n"
                                }
                            }
                            embed.addField("Location supply", upLoc)

                            msg.channel.send(embed)
                        }
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
        args[1] = args[1].toLowerCase()
        switch (args[1]) {
            case "zaza":
                sell("drugs", "Zaza", args[2])
                break
            case "h":
                sell("drugs", "H", args[2])
                break
            case "coke":
                sell("drugs", "Coke", args[2])
                break
            case "crystal":
                sell("drugs", "Crystal", args[2])
                break
            case "molly":
                sell("drugs", "Molly", args[2])
                break
            case "mystery":
                sell("drugs", "Mystery_pills", args[3])
                break
            case "ar":
                sell("arms", "AR", args[2])
                break
            case "handgun":
                sell("arms", "Handgun", args[2])
                break
            case "explosive":
                sell("arms", "Explosive", args[2])
                break
            case "lethal":
                sell("arms", "Lethal_service", args[3])
                break
            case "lab":
                sell("locations", "Lab", args[2])
                break
            case "cover":
                sell("locations", "Cover_store", args[3])
                break
            case "farm":
                sell("locations", "Farm", args[2])
                break
            case "pharmacy":
                sell("locations", "Pharmacy", args[2])
                break
        }
    },
};