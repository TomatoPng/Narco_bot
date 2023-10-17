const Discord = require('discord.js')
const fs = require('fs')
const axios = require('axios')

const narco = new Discord.Client()
const prefix = "$"

narco.on("ready", () => {
    console.log("Narco is online")
})

narco.coms = new Discord.Collection();
narco.dev = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const devFiles = fs.readdirSync('./dev').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    narco.coms.set(command.name, command);
}

for (const file of devFiles) {
    const command = require(`./dev/${file}`);
    narco.dev.set(command.name, command);
}

const devArr = ["982063577026424893"]

function serverRec() {
    return axios.get('http://localhost:4200/data')
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
function serverSend(data) {
    return axios.post('http://localhost:4200/data', data)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.error(error);
        });
}


function ozToLbs(oz) {
    var lbs = oz / 16;
    return lbs;
}


function lbsToOz(lbs) {
    var oz = lbs * 16;
    return oz;
}

function findDuplicateCounts(arr) {
    const frequencyMap = new Map();
    const countsArray = [];

    // Count the occurrences of each element
    arr.forEach(value => {
        if (frequencyMap.has(value)) {
            frequencyMap.set(value, frequencyMap.get(value) + 1);
        } else {
            frequencyMap.set(value, 1);
        }
    });

    // Create arrays for values and their counts, but only add if not already added
    frequencyMap.forEach((count, value) => {
        const existingEntry = countsArray.find(entry => entry[0] === value && entry[1] === count);
        if (!existingEntry) {
            countsArray.push([value, count]);
        }
    });

    return countsArray;
}



narco.utils = {
    send: serverSend,
    recieve: serverRec,
    ozToLbs: ozToLbs,
    lbsToOz: lbsToOz,
    duplicates: findDuplicateCounts
}

const storage = {
    dealerId: 0
}

narco.utils.recieve()
    .then(res => {
        const serverData = res.data
        var data1 = serverData
        for (let i = 0; i < serverData.userData.length; i++) {
            var initalId = serverData.userData[i].id
            for (let j = 0; j < serverData.userData[i].assets.facilities.length; j++) {
                setInterval(() => {
                    narco.utils.recieve()
                        .then(res => {
                            data1 = res.data
                        })
                        .catch(err => console.error(err))
                    switch (data1.userData[i].assets.facilities[j].narcType) {
                        case "seller":
                            if (!data1.userData[i].assets.facilities[j].isSupplied || parseInt(data1.userData[i].assets.facilities[j].product.amm) < parseInt(data1.userData[i].assets.facilities[j].qps)) {
                                narco.utils.recieve()
                                    .then(res => {
                                        var data2 = res.data
                                        data2.userData[i].notifications.push("Facility " + data1.userData[i].assets.facilities[j].type + " #" + data1.userData[i].assets.facilities[j].id + " is not supplied currently")
                                        narco.utils.send(data2)
                                            .then(res => { })
                                            .catch(err => console.error(err))
                                        return
                                    })
                            } else {
                                switch (data1.userData[i].assets.facilities[j].product.type) {
                                    case "drugs":
                                        data1.userData[i].money.bank += data1.userData[i].assets.facilities[j].productCost
                                        data1.userData[i].assets.facilities[j].product.amm = (parseInt(data1.userData[i].assets.facilities[j].product.amm) - parseInt(data1.userData[i].assets.facilities[j].qps)).toString() + " oz"
                                        data1.userData[i].notifications.push("Facility " + data1.userData[i].assets.facilities[j].type + " #" + data1.userData[i].assets.facilities[j].id + " sold $" + data1.userData[i].assets.facilities[j].productCost + " worth of " + data1.userData[i].assets.facilities[j].supplyType)
                                        narco.utils.send(data1)
                                            .then(res => {

                                            })
                                            .catch(err => {

                                            })
                                        break
                                    case "arms":
                                        data1.userData[i].money.bank += data1.userData[i].assets.facilities[j].productCost
                                        data1.userData[i].assets.facilities[j].product.amm = (data1.userData[i].assets.facilities[j].product.amm - data1.userData[i].assets.facilities[j].qps).toString() + " oz"
                                        data1.userData[i].notifications.push("Facility " + data1.userData[i].assets.facilities[j].type + " #" + data1.userData[i].assets.facilities[j].id + " sold $" + data1.userData[i].assets.facilities[j].productCost + " worth of " + data1.userData[i].assets.facilities[j].supplyType)
                                        narco.utils.send(data1)
                                            .then(res => {

                                            })
                                            .catch(err => {

                                            })
                                        break
                                }
                            }
                            break
                        case "produce":
                            switch (data1.userData[i].assets.facilities[j].product.type) {
                                case "drugs":
                                    data1.userData[i].assets.facilities[j].product.amm = (parseInt(data1.userData[i].assets.facilities[j].product.amm) + parseInt(data1.userData[i].assets.facilities[j].qps)).toString() + " oz"
                                    data1.userData[i].notifications.push("Facility " + data1.userData[i].assets.facilities[j].type + " #" + data1.userData[i].assets.facilities[j].id + " sold $" + data1.userData[i].assets.facilities[j].supplyCost + " worth of " + data1.userData[i].assets.facilities[j].supplyType)
                                    narco.utils.send(data1)
                                        .then(res => {

                                        })
                                        .catch(err => {

                                        })
                                    break
                                case "arms":
                                    data1.userData[i].assets.facilities[j].product.amm = data1.userData[i].assets.facilities[j].product.amm + parseInt(data1.userData[i].assets.facilities[j].qps)
                                    data1.userData[i].notifications.push("Facility " + data1.userData[i].assets.facilities[j].type + " #" + data1.userData[i].assets.facilities[j].id + " sold $" + data1.userData[i].assets.facilities[j].supplyCost + " worth of " + data1.userData[i].assets.facilities[j].supplyType)
                                    narco.utils.send(data1)
                                        .then(res => {

                                        })
                                        .catch(err => {

                                        })
                                    break
                            }
                            break
                    }
                },/* ((data1.userData[i].assets.facilities[j].produceInterval * 1000) * 60)*/ 1000)
            }
            for (let j = 0; j < serverData.userData[i].assets.dealers.length; j++) {
                if (!storage[serverData.userData[i].name] || !storage[serverData.userData[i].name].dealers) {
                    storage[serverData.userData[i].name] = {}
                    storage[serverData.userData[i].name].dealers = {}
                    storage[serverData.userData[i].name].dealers[serverData.userData[i].assets.dealers[j].name] = {}
                }
                try {
                    storage[serverData.userData[i].name].dealers[serverData.userData[i].assets.dealers[j].name].payInterval = setInterval(() => {
                        narco.utils.recieve()
                            .then(res => {
                                data1 = res.data
                            })
                            .catch(err => console.error(err))
                        for (let j = 0; j < data1.userData.length; j++) {
                            if (data1.userData[j].id === initalId) {
                                if (data1.userData[i].money.bank < data1.userData[i].assets.dealers[j].hirePrice) {
                                    data1.userData[i].notifications.push("You do not have the funds in your bank to pay " + data1.userData[i].assets.dealers[j].name + "the" + data1.userData[i].assets.dealers[j].type + "dealer, they are being removed from your hired dealers")
                                    data1.userData[i].assets.dealers.splice(data1.userData[i].assets.dealers.indexOf(data1.userData[i].assets.dealers[j]), 1)
                                    return
                                }
                                data1.userData[i].money.bank -= data1.userData[i].assets.dealers[j].hirePrice

                                narco.utils.send(data1)
                                    .then(res => {
                                        data1.userData[i].notifications.push("You payed " + data1.userData[i].assets.dealers[j].name + " their hourly pay")
                                        narco.utils.send(data1)
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
                } catch (err) {

                }
                try {
                    storage[serverData.userData[i].name].dealers[serverData.userData[i].assets.dealers[j].name].sellInterval = setInterval(() => {
                        narco.utils.recieve()
                            .then(res => {
                                data1 = res.data
                            })
                            .catch(err => console.error(err))
                        for (let j = 0; j < data1.userData.length; j++) {
                            if (data1.userData[j].id === initalId) {
                                narco.utils.recieve()
                                    .then(res => {
                                        var sellPrice
                                        const category = data1.userData[i].assets.dealers[j].type
                                        switch (category) {
                                            case "drug":
                                                sellPrice = 10 + (2500 - 10) * (data1.userData[i].assets.dealers[j].supplyQuality / 200)
                                                var ammType = data1.userData[i].assets.dealers[j].sellType
                                                switch (ammType) {
                                                    case "oz":
                                                        if (parseInt(data1.userData[i].assets.dealers[j].supplyAmm) < data1.userData[i].assets.dealers[j].stats.pitching) {
                                                            data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].product + " dealer did not have enough supply to sell product")
                                                            narco.utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {
                                                                    console.error(err)
                                                                })
                                                            return
                                                        }
                                                        data1.userData[i].assets.dealers[j].supplyAmm = (parseInt(data1.userData[i].assets.dealers[j].supplyAmm) - data1.userData[i].assets.dealers[j].stats.pitching).toString() + " oz"
                                                        data1.userData[i].money.bank += sellPrice * data1.userData[i].assets.dealers[j].stats.pitching
                                                        narco.utils.send(data1)
                                                            .then(res => {
                                                                data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].type + " dealer sold " + data1.userData[i].assets.dealers[j].stats.pitching + " of " + data1.userData[i].assets.dealers[j].product.toLowerCase() + " for $" + (sellPrice * data1.userData[i].assets.dealers[j].stats.pitching).toString())
                                                                narco.utils.send(data1)
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
                                                        if (parseInt(data1.userData[i].assets.dealers[j].supplyAmm) < (data1.userData[i].assets.dealers[j].stats.pitching * 16)) {
                                                            data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].product + " dealer did not have enough supply to sell product")
                                                            narco.utils.send(data1)
                                                                .then(res => {

                                                                })
                                                                .catch(err => {
                                                                    console.error(err)
                                                                })
                                                            return
                                                        }
                                                        data1.userData[i].assets.dealers[j].supplyAmm = (parseInt(data1.userData[i].assets.dealers[j].supplyAmm) - (data1.userData[i].assets.dealers[j].stats.pitching * 16)).toString() + " oz"
                                                        data1.userData[i].money.bank += sellPrice * (data1.userData[i].assets.dealers[j].stats.pitching * 16)
                                                        narco.utils.send(data1)
                                                            .then(res => {
                                                                data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].type + " dealer sold " + (data1.userData[i].assets.dealers[j].stats.pitching * 16) + " of " + data1.userData[i].assets.dealers[j].product.toLowerCase() + " for $" + (sellPrice * (data1.userData[i].assets.dealers[j].stats.pitching * 16)).toString())
                                                                narco.utils.send(data1)
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
                                                sellPrice = 1000 + (10000 - 1000) * (data1.userData[i].assets.dealers[j].supplyQuality / 200)
                                                if (data1.userData[i].assets.dealers[j].supplyAmm < data1.userData[i].assets.dealers[j].stats.pitching) {
                                                    data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].product + " dealer did not have enough supply to sell product")
                                                    narco.utils.send(data1)
                                                        .then(res => {

                                                        })
                                                        .catch(err => {
                                                            console.error(err)
                                                        })
                                                    return
                                                }
                                                data1.userData[i].assets.dealers[j].supplyAmm = (data1.userData[i].assets.dealers[j].supplyAmm - data1.userData[i].assets.dealers[j].stats.pitching)
                                                data1.userData[i].money.bank += sellPrice * data1.userData[i].assets.dealers[j].stats.pitching
                                                narco.utils.send(data1)
                                                    .then(res => {
                                                        data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].type + " dealer sold " + data1.userData[i].assets.dealers[j].stats.pitching + " of " + data1.userData[i].assets.dealers[j].product.toLowerCase() + " for $" + (sellPrice * data1.userData[i].assets.dealers[j].stats.pitching).toString())
                                                        narco.utils.send(data1)
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
                                                sellPrice = 10000 + (100000 - 10000) * (data1.userData[i].assets.dealers[j].supplyQuality / 200)
                                                if (data1.userData[i].assets.dealers[j].supplyAmm < data1.userData[i].assets.dealers[j].stats.pitching) {
                                                    data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].product + " dealer did not have enough supply to sell product")
                                                    narco.utils.send(data1)
                                                        .then(res => {

                                                        })
                                                        .catch(err => {
                                                            console.error(err)
                                                        })
                                                    return
                                                }
                                                data1.userData[i].assets.dealers[j].supplyAmm = (data1.userData[i].assets.dealers[j].supplyAmm - data1.userData[i].assets.dealers[j].stats.pitching)
                                                data1.userData[i].money.bank += sellPrice * data1.userData[i].assets.dealers[j].stats.pitching
                                                narco.utils.send(data1)
                                                    .then(res => {
                                                        data1.userData[i].notifications.push(data1.userData[i].assets.dealers[j].name + " the " + data1.userData[i].assets.dealers[j].type + " dealer sold " + data1.userData[i].assets.dealers[j].stats.pitching + " of " + data1.userData[i].assets.dealers[j].product.toLowerCase() + " for $" + (sellPrice * data1.userData[i].assets.dealers[j].stats.pitching).toString())
                                                        narco.utils.send(data1)
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


                                    })
                                    .catch(err => {
                                        console.error(err)
                                    })
                            }
                        }
                    }, ((100 - data1.userData[i].assets.dealers[j].stats.efficiency) * 60000))
                } catch (err) {

                }
            }
        }
    })
    .catch(err => console.error(err))

narco.on('message', msg => {
    if (msg.author.bot) return;

    if (msg.content.split(' ')[0].toLowerCase() === "buy" || msg.content.split(' ')[0].toLowerCase() === "hire" || msg.content.split(' ')[0].toLowerCase() === "sign" && msg.mentions.users.has("1127748008855998555")) {
        narco.coms.get("args").execute(msg, msg.content.split(" "), narco.utils, storage)
    }

    if (!msg.content.split(" ")[0].includes("$")) return

    const args = msg.content.split(prefix)[1].split(" ")
    const commandName = args[0].toLowerCase()

    if (msg.content.split(prefix)[0] === "d") {

        function checkRegister() {
            narco.utils.recieve()
                .then(res => {
                    var data = res.data
                    var isIn = false
                    for (let i = 0; i < data.userData.length; i++) {
                        if (data.userData[i].id === msg.author.id) {
                            isIn = true
                        }
                    }
                    if (!isIn) {
                        var data1 = data
                        data1.userData.push({
                            id: msg.author.id,
                            name: msg.author.username,
                            money: {
                                bank: 30000,
                                wallet: 1000
                            },
                            assets: {
                                supply: {
                                    drugs: {
                                        Zaza:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        H:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Coke:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Crystal:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Molly:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Mystery_pills:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }

                                    },
                                    arms: {
                                        AR: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Handgun: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Explosive: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Lethal_service: {
                                            amm: 0,
                                            quality: 0
                                        }
                                    },
                                    locations: {
                                        Lab: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Cover_store: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Farm: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Pharmacy: {
                                            amm: 0,
                                            quality: 0
                                        }
                                    }
                                },
                                facilities: [

                                ],
                                dealers: [

                                ]
                            },
                            notifications: [

                            ]
                        })
                        narco.utils.send(data1)
                        msg.channel.send("Registered you into Narco database")
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }

        if (!devArr.includes(msg.author.id)) {
            msg.channel.send("You do not have permission to use these commands")
            return
        }
        if (!narco.dev.has(commandName)) return;

        const cmd = narco.dev.get(commandName);

        function run() {
            try {
                cmd.execute(msg, args, narco.utils, storage);
            } catch (error) {
                console.error(error);
                msg.reply('Command does not seem to work at this time');
            }
        }

        function execute() {
            checkRegister()
            setTimeout(() => run(), 250)
        }

        execute()
    } else if (msg.content.split(prefix)[0] === "") {
        if (!narco.coms.has(commandName)) return;

        function checkRegister() {
            narco.utils.recieve()
                .then(res => {
                    var data = res.data
                    var isIn = false
                    for (let i = 0; i < data.userData.length; i++) {
                        if (data.userData[i].id === msg.author.id) {
                            isIn = true
                        }
                    }
                    if (!isIn) {
                        var data1 = data
                        data1.userData.push({
                            id: msg.author.id,
                            name: msg.author.username,
                            money: {
                                bank: 30000,
                                wallet: 1000
                            },
                            assets: {
                                supply: {
                                    drugs: {
                                        Zaza:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        H:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Coke:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Crystal:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Molly:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }
                                        ,
                                        Mystery_pills:
                                        {
                                            amm: "0 oz",
                                            quality: 0
                                        }

                                    },
                                    arms: {
                                        AR: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Handgun: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Explosive: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Lethal_service: {
                                            amm: 0,
                                            quality: 0
                                        }
                                    },
                                    locations: {
                                        Lab: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Cover_store: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Farm: {
                                            amm: 0,
                                            quality: 0
                                        },
                                        Pharmacy: {
                                            amm: 0,
                                            quality: 0
                                        }
                                    }
                                },
                                facilities: [

                                ],
                                dealers: [

                                ]
                            },
                            notifications: [

                            ]
                        })
                        narco.utils.send(data1)
                        msg.channel.send("Registered you into Narco database")
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }

        const cmd = narco.coms.get(commandName);

        function run() {
            try {
                cmd.execute(msg, args, narco.utils, storage);
            } catch (error) {
                console.error(error);
                msg.reply('Command does not seem to work at this time');
            }
        }

        function execute() {
            checkRegister()
            setTimeout(() => run(), 250)
        }

        execute()
    }
});

narco.login("")