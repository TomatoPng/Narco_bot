const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "args",
    execute(msg, args, utils, storage) {
        args[0] = args[0].toLowerCase()
        switch (args[0]) {
            case "buy":
                if (storage[msg.author.username] === undefined || storage[msg.author.username].currentDealer === undefined) {
                    return
                }
                function drugUpdate(data1, drugObj) {
                    for (let i = 0; i < data1.userData.length; i++) {
                        if (data1.userData[i].id === msg.author.id) {
                            const amm = parseInt(args[1])
                            if (args[1]) {
                                if (isNaN(parseInt(args[1]))) {
                                    msg.channel.send("Please enter correct parameters, if confused use $help")
                                    return
                                }

                                if (data1.userData[i].money.wallet < (storage[msg.author.username].currentDealer.sellAmm * amm)) {
                                    msg.channel.send("You do not have the funds in your wallet to buy from the dealer")
                                    return
                                }
                                switch (storage[msg.author.username].currentDealer.sellType) {
                                    case "oz":
                                        data1.userData[i].assets.supply.drugs[drugObj].amm = (parseInt(data1.userData[i].assets.supply.drugs[drugObj].amm.split(' ')[0]) + amm).toString() + " oz"
                                        msg.channel.send("you just bought " + amm + " " + storage[msg.author.username].currentDealer.product + " for $" + (storage[msg.author.username].currentDealer.sellAmm * amm))
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply.drugs[drugObj].quality < 200) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality + (storage[msg.author.username].currentDealer.sellAmm / 10))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality - (storage[msg.author.username].currentDealer.sellAmm / 10))
                                        }
                                        break
                                    case "lb":
                                        data1.userData[i].assets.supply.drugs[drugObj].amm = (parseInt(data1.userData[i].assets.supply.drugs[drugObj].amm.split(' ')[0]) + (16 * amm)).toString() + " oz"
                                        msg.channel.send("you just bought " + amm + " " + storage[msg.author.username].currentDealer.product + " for $" + (storage[msg.author.username].currentDealer.sellAmm * amm))
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply.drugs[drugObj].quality < 200) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality + (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality - (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        }
                                        break
                                }
                                data1.userData[i].money.wallet -= (storage[msg.author.username].currentDealer.sellAmm * amm)
                            } else {
                                switch (storage[msg.author.username].currentDealer.sellType) {
                                    case "oz":
                                        if (data1.userData[i].money.wallet < storage[msg.author.username].currentDealer.sellAmm) {
                                            msg.channel.send("You do not have the funds in your wallet to buy from the dealer")
                                            return
                                        }
                                        data1.userData[i].assets.supply.drugs[drugObj].amm = (parseInt(data1.userData[i].assets.supply.drugs[drugObj].amm.split(' ')[0]) + 1).toString() + " oz"
                                        msg.channel.send("you just bought a " + storage[msg.author.username].currentDealer.product + " for $" + storage[msg.author.username].currentDealer.sellAmm)
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply.drugs[drugObj].quality < 200) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality + (storage[msg.author.username].currentDealer.sellAmm / 10))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality - (storage[msg.author.username].currentDealer.sellAmm / 10))
                                        }
                                        break
                                    case "lb":
                                        if (data1.userData[i].money.wallet < storage[msg.author.username].currentDealer.sellAmm) {
                                            msg.channel.send("You do not have the funds in your wallet to buy from the dealer")
                                            return
                                        }
                                        data1.userData[i].assets.supply.drugs[drugObj].amm = (parseInt(data1.userData[i].assets.supply.drugs[drugObj].amm.split(' ')[0]) + 16).toString() + " oz"
                                        msg.channel.send("you just bought a " + storage[msg.author.username].currentDealer.product + " for $" + storage[msg.author.username].currentDealer.sellAmm)
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply.drugs[drugObj].quality < 200) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality + (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply.drugs[drugObj].quality = (data1.userData[i].assets.supply.drugs[drugObj].quality - (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        }
                                        break
                                }
                                data1.userData[i].money.wallet -= storage[msg.author.username].currentDealer.sellAmm
                            }

                            utils.send(data1)
                                .then(res => {
                                    const serverData = data1

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
                                })
                                .catch(err => {
                                    console.error(err)
                                })
                        }
                    }
                }
                function aolUpdate(data1, obj, aol) {
                    for (let i = 0; i < data1.userData.length; i++) {
                        if (data1.userData[i].id === msg.author.id) {
                            const amm = parseInt(args[1])
                            if (args[1]) {
                                if (isNaN(parseInt(args[1]))) {
                                    msg.channel.send("Please enter correct parameters, if confused use $help")
                                    return
                                }
                                if (data1.userData[i].money.wallet < (storage[msg.author.username].currentDealer.sellAmm * amm)) {
                                    msg.channel.send("You do not have the funds in your wallet to buy from the dealer")
                                    return
                                }
                                switch (aol) {
                                    case "arms":
                                        data1.userData[i].assets.supply[aol][obj].amm += amm
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply[aol][obj].quality < 200) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality + (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality - (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        }
                                        break
                                    case "locations":
                                        data1.userData[i].assets.supply[aol][obj].amm += amm
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply[aol][obj].quality < 200) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality + (storage[msg.author.username].currentDealer.sellAmm / 1000))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality - (storage[msg.author.username].currentDealer.sellAmm / 1000))
                                        }
                                        break
                                }
                                data1.userData[i].money.wallet -= (storage[msg.author.username].currentDealer.sellAmm * amm)
                            } else {
                                if (data1.userData[i].money.wallet < storage[msg.author.username].currentDealer.sellAmm) {
                                    msg.channel.send("You do not have the funds in your wallet to buy from the dealer")
                                    return
                                }
                                switch (aol) {
                                    case "arms":
                                        data1.userData[i].assets.supply[aol][obj].amm++
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply[aol][obj].quality < 200) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality + (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality - (storage[msg.author.username].currentDealer.sellAmm / 100))
                                        }
                                        break
                                    case "locations":
                                        data1.userData[i].assets.supply[aol][obj].amm++
                                        if (storage[msg.author.username].currentDealer.sellAmm > storage[msg.author.username].currentDealer.qualThreshold && data1.userData[i].assets.supply[aol][obj].quality < 200) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality + (storage[msg.author.username].currentDealer.sellAmm / 1000))
                                        } else if (storage[msg.author.username].currentDealer.sellAmm < storage[msg.author.username].currentDealer.qualThreshold) {
                                            data1.userData[i].assets.supply[aol][obj].quality = (data1.userData[i].assets.supply[aol][obj].quality - (storage[msg.author.username].currentDealer.sellAmm / 1000))
                                        }
                                        break
                                }
                                data1.userData[i].money.wallet -= (storage[msg.author.username].currentDealer.sellAmm)
                            }
                            utils.send(data1)
                                .then(res => {
                                    const serverData = data1
                                    if (args[1]) {
                                        msg.channel.send("you just bought " + amm + " " + storage[msg.author.username].currentDealer.product + " for $" + (storage[msg.author.username].currentDealer.sellAmm * parseInt(args[1])).toString())
                                    } else {
                                        msg.channel.send("you just bought a " + storage[msg.author.username].currentDealer.product + " for $" + storage[msg.author.username].currentDealer.sellAmm)
                                    }

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
                                })
                                .catch(err => {
                                    console.error(err)
                                })
                        }
                    }
                }
                switch (storage[msg.author.username].currentDealer.product) {
                    case "AR":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "AR", "arms")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Handgun":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Handgun", "arms")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Explosive":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Explosive", "arms")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Lethal Service":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Lethal_service", "arms")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Lab":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Lab", "locations")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Cover Store":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Cover_store", "locations")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Farm":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Farm", "locations")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    case "Pharmacy":
                        utils.recieve()
                            .then(res => {
                                const serverData = res.data
                                var data1 = serverData
                                aolUpdate(data1, "Pharmacy", "locations")
                            })
                            .catch(err => {
                                console.error(err)
                            })
                        break
                    default:
                        switch (storage[msg.author.username].currentDealer.product.split(" of ")[1]) {
                            case "Zaza":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "Zaza")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                            case "H":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "H")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                            case "Coke":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "Coke")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                            case "Crystal":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "Crystal")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                            case "Molly":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "Molly")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                            case "Mystery Pills":
                                utils.recieve()
                                    .then(res => {
                                        const serverData = res.data
                                        var data1 = serverData
                                        drugUpdate(data1, "Mystery_pills")
                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                                break
                        }
                        break
                }
                if (storage[msg.author.username]?.currentDealer?.message) {
                    storage[msg.author.username].currentDealer.message
                        .then(mesg => {
                            if (mesg) {
                                mesg.delete()
                            }
                        })
                }
                storage[msg.author.username].currentDealer = undefined
                break
            case "hire":
                if (storage[msg.author.username] === undefined || storage[msg.author.username].currentDealer === undefined) {
                    return
                }
                utils.recieve()
                    .then(res => {
                        const serverData = res.data
                        const data1 = serverData
                        for (let i = 0; i < serverData.userData.length; i++) {
                            if (serverData.userData[i].id === msg.author.id) {
                                if (data1.userData[i].money.bank < storage[msg.author.username].currentDealer.hirePrice) {
                                    msg.channel.send("You do not have the funds in your bank to hire this dealer")
                                    return
                                }
                                data1.userData[i].money.bank -= storage[msg.author.username].currentDealer.hirePrice
                                if (!storage[msg.author.username].dealers) {
                                    storage[msg.author.username].dealers = {}
                                    storage[msg.author.username].dealers[storage[msg.author.username].currentDealer.name] = {}
                                }
                                storage[msg.author.username].dealers[storage[msg.author.username].currentDealer.name].payInterval = setInterval(() => {
                                    narco.utils.recieve()
                                        .then(res => {
                                            data1 = res.data
                                        })
                                        .catch(err => console.error(err))
                                    for (let j = 0; j < data1.userData.length; j++) {
                                        if (data1.userData[j].id === msg.author.id) {
                                            if (data1.userData[i].money.bank < storage[msg.author.username].currentDealer.hirePrice) {
                                                data1.userData[i].notifications.push("You do not have the funds in your bank to pay " + storage[msg.author.username].currentDealer.name + "the" + storage[msg.author.username].currentDealer.type + "dealer, they are being removed from your hired dealers")
                                                data1.userData[i].assets.dealers.splice(data1.userData[i].assets.dealers.indexOf(storage[msg.author.username].currentDealer), 1)
                                                return
                                            }
                                            data1.userData[i].money.bank -= storage[msg.author.username].currentDealer.hirePrice

                                            utils.send(data1)
                                                .then(res => {
                                                    data1.userData[i].notifications.push("You payed " + storage[msg.author.username].currentDealer.name + " their hourly pay")
                                                    utils.send(data1)
                                                        .then(res => {

                                                        })
                                                        .catch(err => {
                                                            console.error(err)
                                                        })
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                })
                                        }
                                    }
                                }, 3600000)
                                storage[msg.author.username].dealers[storage[msg.author.username].currentDealer.name].sellInterval = setInterval(() => {
                                    narco.utils.recieve()
                                        .then(res => {
                                            data1 = res.data
                                        })
                                        .catch(err => console.error(err))
                                    for (let j = 0; j < data1.userData.length; j++) {
                                        if (data1.userData[j].id === msg.author.id) {
                                            utils.recieve()
                                                .then(res => {
                                                    const serverData = res.data
                                                    var data1 = serverData
                                                    var sellPrice
                                                    for (let i = 0; i < data1.userData.length; i++) {
                                                        if (data1.userData[i].id === msg.author.id) {
                                                            for (let j = 0; j < data1.userData[i].assets.dealers.length; j++) {
                                                                if (data1.userData[i].assets.dealers[j].id === storage[msg.author.username].currentDealer.id) {
                                                                    storage[msg.author.username].currentDealer = data1.userData[i].assets.dealers[j]
                                                                }
                                                            }
                                                            storage[msg.author.username].currentDealer
                                                            const category = storage[msg.author.username].currentDealer.type
                                                            switch (category) {
                                                                case "drug":
                                                                    sellPrice = 10 + (2500 - 10) * (storage[msg.author.username].currentDealer.supplyQuality / 200)
                                                                    var ammType = storage[msg.author.username].currentDealer.sellType
                                                                    switch (ammType) {
                                                                        case "oz":
                                                                            if (parseInt(storage[msg.author.username].currentDealer.supplyAmm) < storage[msg.author.username].currentDealer.stats.pitching) {
                                                                                data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.product + " dealer did not have enough supply to sell product")
                                                                                utils.send(data1)
                                                                                    .then(res => {

                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.error(err)
                                                                                    })
                                                                                return
                                                                            }
                                                                            storage[msg.author.username].currentDealer.supplyAmm = (parseInt(storage[msg.author.username].currentDealer.supplyAmm) - storage[msg.author.username].currentDealer.stats.pitching).toString() + " oz"
                                                                            data1.userData[i].money.bank += sellPrice * storage[msg.author.username].currentDealer.stats.pitching
                                                                            utils.send(data1)
                                                                                .then(res => {
                                                                                    data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.type + " dealer sold " + storage[msg.author.username].currentDealer.stats.pitching + " of " + storage[msg.author.username].currentDealer.product.toLowerCase() + " for $" + (sellPrice * storage[msg.author.username].currentDealer.stats.pitching).toString())
                                                                                    utils.send(data1)
                                                                                        .then(res => {

                                                                                        })
                                                                                        .catch(err => {
                                                                                            console.error(err)
                                                                                        })
                                                                                })
                                                                                .catch(err => {
                                                                                    console.error(err)
                                                                                })
                                                                            break
                                                                        case "lb":
                                                                            if (parseInt(storage[msg.author.username].currentDealer.supplyAmm) < (storage[msg.author.username].currentDealer.stats.pitching * 16)) {
                                                                                data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.product + " dealer did not have enough supply to sell product")
                                                                                utils.send(data1)
                                                                                    .then(res => {

                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.error(err)
                                                                                    })
                                                                                return
                                                                            }
                                                                            storage[msg.author.username].currentDealer.supplyAmm = (parseInt(storage[msg.author.username].currentDealer.supplyAmm) - (storage[msg.author.username].currentDealer.stats.pitching * 16)).toString() + " oz"
                                                                            data1.userData[i].money.bank += sellPrice * (storage[msg.author.username].currentDealer.stats.pitching * 16)
                                                                            utils.send(data1)
                                                                                .then(res => {
                                                                                    data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.type + " dealer sold " + (storage[msg.author.username].currentDealer.stats.pitching * 16) + " of " + storage[msg.author.username].currentDealer.product.toLowerCase() + " for $" + (sellPrice * (storage[msg.author.username].currentDealer.stats.pitching * 16)).toString())
                                                                                    utils.send(data1)
                                                                                        .then(res => {

                                                                                        })
                                                                                        .catch(err => {
                                                                                            console.error(err)
                                                                                        })
                                                                                })
                                                                                .catch(err => {
                                                                                    console.error(err)
                                                                                })
                                                                            break
                                                                    }
                                                                    break
                                                                case "arms":
                                                                    sellPrice = 1000 + (10000 - 1000) * (storage[msg.author.username].currentDealer.supplyQuality / 200)
                                                                    if (storage[msg.author.username].currentDealer.supplyAmm < storage[msg.author.username].currentDealer.stats.pitching) {
                                                                        data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.product + " dealer did not have enough supply to sell product")
                                                                        utils.send(data1)
                                                                            .then(res => {

                                                                            })
                                                                            .catch(err => {
                                                                                console.error(err)
                                                                            })
                                                                        return
                                                                    }
                                                                    storage[msg.author.username].currentDealer.supplyAmm = (storage[msg.author.username].currentDealer.supplyAmm - storage[msg.author.username].currentDealer.stats.pitching)
                                                                    data1.userData[i].money.bank += sellPrice * storage[msg.author.username].currentDealer.stats.pitching
                                                                    utils.send(data1)
                                                                        .then(res => {
                                                                            data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.type + " dealer sold " + storage[msg.author.username].currentDealer.stats.pitching + " of " + storage[msg.author.username].currentDealer.product.toLowerCase() + " for $" + (sellPrice * storage[msg.author.username].currentDealer.stats.pitching).toString())
                                                                            utils.send(data1)
                                                                                .then(res => {

                                                                                })
                                                                                .catch(err => {
                                                                                    console.error(err)
                                                                                })
                                                                        })
                                                                        .catch(err => {
                                                                            console.error(err)
                                                                        })
                                                                    break
                                                                case "location":
                                                                    sellPrice = 10000 + (100000 - 10000) * (storage[msg.author.username].currentDealer.supplyQuality / 200)
                                                                    if (storage[msg.author.username].currentDealer.supplyAmm < storage[msg.author.username].currentDealer.stats.pitching) {
                                                                        data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.product + " dealer did not have enough supply to sell product")
                                                                        utils.send(data1)
                                                                            .then(res => {

                                                                            })
                                                                            .catch(err => {
                                                                                console.error(err)
                                                                            })
                                                                        return
                                                                    }
                                                                    storage[msg.author.username].currentDealer.supplyAmm = (storage[msg.author.username].currentDealer.supplyAmm - storage[msg.author.username].currentDealer.stats.pitching)
                                                                    data1.userData[i].money.bank += sellPrice * storage[msg.author.username].currentDealer.stats.pitching
                                                                    utils.send(data1)
                                                                        .then(res => {
                                                                            data1.userData[i].notifications.push(storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.type + " dealer sold " + storage[msg.author.username].currentDealer.stats.pitching + " of " + storage[msg.author.username].currentDealer.product.toLowerCase() + " for $" + (sellPrice * storage[msg.author.username].currentDealer.stats.pitching).toString())
                                                                            utils.send(data1)
                                                                                .then(res => {

                                                                                })
                                                                                .catch(err => {
                                                                                    console.error(err)
                                                                                })
                                                                        })
                                                                        .catch(err => {
                                                                            console.error(err)
                                                                        })
                                                                    break
                                                            }
                                                        }
                                                    }
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                })
                                        }
                                    }
                                }, ((100 - storage[msg.author.username].currentDealer.stats.efficiency) * 60000))
                                data1.userData[i].assets.dealers.push(storage[msg.author.username].currentDealer)
                            }
                        }
                        utils.send(data1)
                            .then(res => {
                                msg.channel.send("You just hired " + storage[msg.author.username].currentDealer.name + " the " + storage[msg.author.username].currentDealer.type + " dealer!")

                                var embed = new MessageEmbed()
                                    .setTitle(msg.author.username + ' Asset Inventory')
                                    .setDescription("You have a new dealer!")
                                    .setColor('#008925')
                                    .setFooter('$help');
                                for (let i = 0; i < serverData.userData.length; i++) {
                                    if (serverData.userData[i].id === msg.author.id) {
                                        embed.addField("Money", "Bank: $" + serverData.userData[i].money.bank.toString() + "\nWallet: $" + serverData.userData[i].money.wallet.toString())
                                    }
                                }
                                var upDealers = ""
                                for (let i = 0; i < data1.userData.length; i++) {
                                    if (data1.userData[i].id === msg.author.id) {
                                        if (data1.userData[i].assets.dealers.length === 0) {
                                            upDealers = "No dealers hired currently"
                                        } else {
                                            for (let j = 0; j < data1.userData[i].assets.dealers.length; j++) {
                                                upDealers = upDealers + data1.userData[i].assets.dealers[j].name + ", The " + data1.userData[i].assets.dealers[j].type + " dealer \n"
                                            }
                                        }
                                    }
                                }
                                embed.addField("Dealers", upDealers)

                                msg.channel.send(embed)
                            })
                            .catch(err => {
                                console.error(err)
                            })
                    })
                    .catch(err => {
                        console.error(err)
                    })
                if (storage[msg.author.username]?.currentDealer?.message) {
                    storage[msg.author.username].currentDealer.message
                        .then(mesg => {
                            if (mesg) {
                                mesg.delete()
                            }
                        })
                }
                storage[msg.author.username].currentDealer = undefined
                break
            case "sign":
                if (storage[msg.author.username] === undefined || storage[msg.author.username].currentFacility === undefined) {
                    return
                }
                utils.recieve()
                    .then(res => {
                        const serverData = res.data
                        var data1 = serverData
                        for (let i = 0; i < serverData.userData.length; i++) {
                            if (serverData.userData[i].id === msg.author.id) {
                                if (data1.userData[i].money.bank < storage[msg.author.username].currentFacility.supplyCost) {
                                    msg.channel.send("You do not have enough money in the bank to sign this contract")
                                    return
                                }
                                data1.userData[i].money.bank -= storage[msg.author.username].currentFacility.supplyCost
                                data1.userData[i].assets.supply.locations[storage[msg.author.username].currentFacility.type].amm--
                                storage[msg.author.username].currentFacility.isSupplied = true
                                data1.userData[i].assets.facilities.push(storage[msg.author.username].currentFacility)

                                setInterval(() => {
                                    utils.recieve()
                                        .then(res => data1 = res.data)
                                    for (let j = 0; j < data1.userData.length; j++) {
                                        if (data1.userData[j].id === msg.author.id) {
                                            utils.recieve()
                                                .then(res => {
                                                    storage[msg.author.username].currentFacility = data1.userData[j].assets.facilities[storage[msg.author.username].currentFacility.id]
                                                })
                                            switch (storage[msg.author.username].currentFacility.narcType) {
                                                case "seller":
                                                    if (!storage[msg.author.username].currentFacility.isSupplied || parseInt(storage[msg.author.username].currentFacility.product.amm) < parseInt(storage[msg.author.username].currentFacility.qps)) {
                                                        utils.recieve()
                                                            .then(res => {
                                                                var data2 = res.data
                                                                data2.userData[i].notifications.push("Facility " + storage[msg.author.username].currentFacility.type + " #" + storage[msg.author.username].currentFacility.id + " is not supplied currently")
                                                                utils.send(data2)
                                                            })
                                                        return
                                                    }
                                                    switch (storage[msg.author.username].currentFacility.product.type) {
                                                        case "drugs":
                                                            data1.userData[i].money.bank += storage[msg.author.username].currentFacility.productCost
                                                            storage[msg.author.username].currentFacility.product.amm = (parseInt(storage[msg.author.username].currentFacility.product.amm) - parseInt(storage[msg.author.username].currentFacility.qps)).toString() + " oz"
                                                            data1.userData[i].notifications.push("Facility " + storage[msg.author.username].currentFacility.type + " #" + storage[msg.author.username].currentFacility.id + " sold $" + storage[msg.author.username].currentFacility.productCost + " worth of " + storage[msg.author.username].currentFacility.supplyType)
                                                            utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {

                                                                })
                                                            break
                                                        case "arms":
                                                            data1.userData[i].money.bank += storage[msg.author.username].currentFacility.productCost
                                                            storage[msg.author.username].currentFacility.product.amm = (storage[msg.author.username].currentFacility.product.amm - storage[msg.author.username].currentFacility.qps).toString() + " oz"
                                                            data1.userData[i].notifications.push("Facility " + storage[msg.author.username].currentFacility.type + " #" + storage[msg.author.username].currentFacility.id + " sold $" + storage[msg.author.username].currentFacility.productCost + " worth of " + storage[msg.author.username].currentFacility.supplyType)
                                                            utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {

                                                                })
                                                            break
                                                    }
                                                    break
                                                case "produce":
                                                    switch (storage[msg.author.username].currentFacility.product.type) {
                                                        case "drugs":
                                                            storage[msg.author.username].currentFacility.product.amm = (parseInt(storage[msg.author.username].currentFacility.product.amm) + parseInt(storage[msg.author.username].currentFacility.qps)).toString() + " oz"
                                                            data1.userData[i].notifications.push("Facility " + storage[msg.author.username].currentFacility.type + " #" + storage[msg.author.username].currentFacility.id + " sold $" + storage[msg.author.username].currentFacility.productCost + " worth of " + storage[msg.author.username].currentFacility.supplyType)
                                                            utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {

                                                                })
                                                            break
                                                        case "arms":
                                                            storage[msg.author.username].currentFacility.product.amm = storage[msg.author.username].currentFacility.product.amm + parseInt(storage[msg.author.username].currentFacility.qps)
                                                            data1.userData[i].notifications.push("Facility " + storage[msg.author.username].currentFacility.type + " #" + storage[msg.author.username].currentFacility.id + " sold $" + storage[msg.author.username].currentFacility.productCost + " worth of " + storage[msg.author.username].currentFacility.supplyType)
                                                            utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {

                                                                })
                                                            break
                                                    }
                                                    break
                                            }
                                        }
                                    }
                                }, ((storage[msg.author.username].currentFacility.produceInterval * 1000) * 60))
                                utils.send(data1)
                                    .then(res => {
                                        storage[msg.author.username].currentFacility = undefined
                                    })
                                    .catch(err => { console.error(err) })
                                var embed = new MessageEmbed()
                                    .setTitle('New facility')
                                    .setDescription("You now have this facility: ")
                                    .setColor('#008925')
                                    .setFooter('$help');
                                embed.addField("Facility id:", storage[msg.author.username].currentFacility.id.toString())
                                msg.channel.send(embed)
                            }
                        }
                    })
                    .catch(err => console.error(err))
                break
        }
    },
};