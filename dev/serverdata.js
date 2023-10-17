const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
    name: 'serverdata',
    description: 'responds with current serverdata',
    execute(msg, args, utils) {
        utils.recieve()
            .then(res => {
                const serverData = res.data
                console.log(JSON.stringify(serverData, null, 2))
                if (!args[1]) {
                    if (JSON.stringify(serverData, null, 2).length > 2000) return
                    msg.channel.send(JSON.stringify(res.data, null, 2))
                } else {
                    if (JSON.stringify(serverData.userData[i], null, 2).length > 2000) return
                    for (let i = 0; i < serverData.userData.length; i++) {
                        if (serverData.userData[i].id === msg.mentions.users.first().id) {
                            msg.channel.send(JSON.stringify(serverData.userData[i], null, 2))
                        }
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })

    },
};
