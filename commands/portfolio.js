const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'portfolio',
    description: 'List all the business assets you have',
    execute(msg, args, utils, storage) {
        utils.recieve()
            .then(response => {
                const serverData = response.data;
                var data1 = serverData
                if (serverData && serverData.userData) {
                    const embed = new MessageEmbed()
                        .setTitle(msg.author.username + ' Narco Portfolio')
                        .setDescription("")
                        .setColor('#008925')
                        .setFooter('This data does not update real-time. If you want to see updated data, run the command again.');

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
    }
}