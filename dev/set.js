const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'set',
    description: 'Set a value of a person portfolio (d$set <user> <value-name> <new-value>)',
    execute(msg, args, utils) {
        var data
        utils.recieve()
            .then(response => {
                const serverData = response.data;

                if (serverData && serverData.userData) {
                    if (!msg.mentions.users.first()) return
                    var data1 = serverData
                    for (let i = 0; i < serverData.userData.length; i++) {
                        if (serverData.userData[i].id === msg.mentions.users.first().id) {
                            switch (args[2]) {
                                case "money-bank":
                                    data1.userData[i].money.bank = parseInt(args[3])
                                    break
                                case "money-wallet":
                                    data1.userData[i].money.wallet = parseInt(args[3])
                                    break
                                case "supply-drugs-amm":
                                    data1.userData[i].assets.supply.drugs[args[4]].amm = parseInt(args[3]).toString() + " oz"
                                    break
                                case "supply-drugs-quality":
                                    data1.userData[i].assets.supply.drugs[args[4]].quality = parseInt(args[3])
                                    break
                                case "supply-arms-amm":
                                    data1.userData[i].assets.supply.arms[args[4]].amm = parseInt(args[3])
                                    break
                                case "supply-arms-quality":
                                    data1.userData[i].assets.supply.arms[args[4]].quality = parseInt(args[3])
                                    break
                                case "supply-locations-amm":
                                    data1.userData[i].assets.supply.locations[args[4]].amm = parseInt(args[3])
                                    break
                                case "supply-locations-quality":
                                    data1.userData[i].assets.supply.locations[args[4]].quality = parseInt(args[3])
                                    break
                            }
                            utils.send(data1)
                                .then(response => {
                                    utils.recieve()
                                        .then(res => {
                                            const serverData = res.data;

                                            if (serverData && serverData.userData) {
                                                const embed = new MessageEmbed()
                                                    .setTitle(msg.mentions.users.first().username + ' Narco Portfolio')
                                                    .setDescription("")
                                                    .setColor('#11008F')
                                                    .setFooter('This data does not update real-time. If you want to see updated data, run the command again.');

                                                for (let i = 0; i < serverData.userData.length; i++) {
                                                    if (serverData.userData[i].id === msg.mentions.users.first().id) {
                                                        embed.addField("Money", "Bank: " + serverData.userData[i].money.bank.toString() + "\nWallet: " + serverData.userData[i].money.wallet.toString())
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

                                                msg.channel.send(embed);
                                            } else {
                                                msg.reply('No user data found.');
                                            }
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            msg.reply('An error occurred while fetching server data');
                                        });
                                    msg.channel.send("Data successfully updated")
                                })
                                .catch(err => {
                                    msg.channel.send(err)
                                })
                        }
                    }
                } else {
                    msg.reply('No user data found.');
                }
            })
            .catch(error => {
                console.error(error);
                msg.reply('An error occurred while fetching server data');
            });
    },
};
