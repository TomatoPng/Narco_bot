const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'withdraw',
    description: 'take money from your bank to your wallet \nex: $withdraw 10500',
    execute(msg, args, utils) {
        if (!args[1]) {
            msg.channel.send("Please enter the ammount you want to withdraw")
            return
        }
        if (isNaN(parseInt(args[1]))) {
            msg.channel.send("Please enter correct parameters, if confused use $help")
            return
        }
        utils.recieve()
            .then(res => {
                const serverData = res.data
                var data1 = serverData
                for (let i = 0; i < data1.userData.length; i++) {
                    if (data1.userData[i].id === msg.author.id) {
                        if (parseInt(args[1]) > data1.userData[i].money.bank) {
                            msg.channel.send("You do not have this ammount in your bank")
                            return
                        }
                        data1.userData[i].money.bank -= parseInt(args[1])
                        data1.userData[i].money.wallet += parseInt(args[1])
                        utils.send(data1)
                            .then(res => {
                                msg.channel.send("Successfully transferred $" + args[1] + " to your wallet")
                                const embed = new MessageEmbed()
                                    .setTitle(msg.author.username + ' Narco money')
                                    .setDescription("")
                                    .setColor('#008925')
                                    .setFooter('$help');
                                embed.addField("Money", "Bank: $" + data1.userData[i].money.bank.toString() + "\nWallet: $" + data1.userData[i].money.wallet.toString())
                                msg.channel.send(embed)
                            })
                            .catch(err => {
                                console.error(err)
                            })
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    },
};