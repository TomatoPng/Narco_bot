const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'notifications',
    description: 'tells you recent events',
    execute(msg, args, utils, storage) {
        utils.recieve()
            .then(res => {
                const serverData = res.data

                var desc = ""
                for (let i = 0; i < serverData.userData.length; i++) {
                    if (serverData.userData[i].id === msg.author.id) {
                        for (let k = 0; k < utils.duplicates(serverData.userData[i].notifications).length; k++) {
                            desc = desc + utils.duplicates(serverData.userData[i].notifications)[k][0] + ", " + utils.duplicates(serverData.userData[i].notifications)[k][1].toString() + "x\n"
                            console.log(utils.duplicates(serverData.userData[i].notifications))
                        }
                    }
                    var data1 = serverData
                    data1.userData[i].notifications.splice(0, data1.userData[i].notifications.length)
                    utils.send(data1)
                        .then(res => { })
                        .catch(err => console.error(err))
                }

                var embed = new MessageEmbed()
                    .setTitle(msg.author.username + ' recent notifications')
                    .setDescription(desc)
                    .setColor('#008925')
                    .setFooter('these notifications will be cleared now');

                if (desc.length > 2000) {
                    msg.channel.send("Message was too long, please try again later")
                    return
                }
                msg.channel.send(embed)
            })
            .catch(err => {
                console.error(err)
            })
    },
};
