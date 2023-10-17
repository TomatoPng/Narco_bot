const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'find',
    description: 'find a dealer of sorts to buy from or hire',
    execute(msg, args, utils, storage) {
        const dealerTypes = ["drug", "location", "arms"]
        const girlNames = ['Isabella', 'Sofia', 'Gabriella', 'Valentina', 'Mia', 'Alessia', 'Lucia', 'Carmen', 'Mariana', 'Adriana', 'Bianca', 'Natalia', 'Gianna', 'Victoria', 'Olivia', 'Luna', 'Camila', 'Emma', 'Sara', 'Arianna', 'Aurora', 'Paola', 'Valeria', 'Maria', 'Angelica', 'Gloria', 'Elena', 'Clara', 'Francesca', 'Carolina', 'Anabella', 'Laura', 'Daniela', 'Rosa', 'Juliana', 'Viviana', 'Antonella', 'Amanda', 'Luisa', 'Frida', 'Cecilia', 'Diana', 'Alma', 'Marianne', 'Serena', 'Beatriz', 'Alexa', 'Ximena'];
        const boyNames = ['Giovanni', 'Marco', 'Diego', 'Alessandro', 'Antonio', 'Roberto', 'Francesco', 'Alejandro', 'Javier', 'Carlos', 'Gabriel', 'Leonardo', 'Matteo', 'Luca', 'Dominic', 'Riccardo', 'Rafael', 'Lorenzo', 'Felipe', 'Enrico', 'Miguel', 'Salvatore', 'Eduardo', 'Sebastian', 'Raul', 'Vincenzo', 'Hector', 'Emilio', 'Dante', 'Federico', 'Adrian', 'Pietro', 'Guillermo', 'Samuele', 'Mario', 'Roberto', 'Andres', 'Emanuel', 'Davide', 'Pedro', 'Ricardo', 'Fernando', 'Santiago', 'Angelo', 'Nicolas', 'Marcelo', 'Bruno'];
        const namesArr = [girlNames, boyNames]
        const sellTypes = ["oz", "lb"]
        const drugs = ["Zaza", "H", "Coke", "Crystal", "Molly", "Mystery Pills"]
        const arms = ["AR", "Handgun", "Explosive", "Lethal Service"]
        const locations = ["Lab", "Cover Store", "Farm", "Pharmacy"]

        var dealerType = dealerTypes[Math.floor(Math.random() * dealerTypes.length)]
        var sellPrice
        var qualThreshold
        switch (dealerType) {
            case "drug":
                sellPrice = Math.floor(Math.random() * 500)
                qualThreshold = 250
                break
            case "location":
                sellPrice = Math.floor(Math.random() * 100000)
                qualThreshold = 50000
                break
            case "arms":
                sellPrice = Math.floor(Math.random() * 4000)
                qualThreshold = 2000
                break
        }

        var hireDif = 0
        switch (dealerType) {
            case "drug":
                while (hireDif === 0) {
                    hireDif = Math.floor(Math.random() * 25)
                }
                break
            case "location":
                while (hireDif === 0) {
                    hireDif = Math.floor(Math.random() * 25000)
                }
                break
            case "arms":
                while (hireDif === 0) {
                    hireDif = Math.floor(Math.random() * 620)
                }
                break
        }

        var sellType = sellTypes[Math.floor(Math.random() * sellTypes.length)]
        if (sellType === "lb" && dealerType === "drug") {
            sellPrice = (sellPrice * 16)
        }

        var pitching = Math.floor(Math.random() * 100)
        var hirePrice1 = 0

        hirePrice1 = (Math.floor(Math.random() * hireDif) * pitching)

        var dealer = {
            type: dealerType,
            stats: {
                efficiency: Math.floor(Math.random() * 100),
                supply: Math.floor(Math.random() * 100),
                pitching: pitching
            },
            name: (namesArr[Math.floor(Math.random() * namesArr.length)])[Math.floor(Math.random() * 20)],
            hirePrice: hirePrice1,
            sellAmm: sellPrice,
            qualThreshold: qualThreshold,
            sellType: sellType,
            id: storage.dealerId,
            supplyQuality: 0,
            supplyInterval: Math.floor(Math.random() * 20),
            supplyAmm: 0
        }

        var product
        switch (dealer.type) {
            case "arms":
                product = arms[Math.floor(Math.random() * arms.length)]
                break
            case "location":
                product = locations[Math.floor(Math.random() * locations.length)]
                break
            case "drug":
                product = dealer.sellType + " of " + drugs[Math.floor(Math.random() * drugs.length)]
                break
        }
        dealer.product = product

        if (storage[msg.author.username]?.currentDealer?.message) {
            storage[msg.author.username].currentDealer.message
                .then(mesg => {
                    if (!mesg.deleted) {
                        mesg.delete()
                    }
                })
        }

        storage[msg.author.username] = {
            currentDealer: {}
        }
        storage[msg.author.username].currentDealer = dealer

        const embed = new MessageEmbed()
            .setTitle('Dealer Finder')
            .setDescription("You found " + dealer.name + "!")
            .addField("Dealer Type : " + dealer.type, " ")
            .addField("Stats", "Efficiency: " + dealer.stats.efficiency + "\nSupply: " + dealer.stats.supply + "\nPitching: " + dealer.stats.pitching)
            .addField("Product", "This dealer sells " + product)
            .addField("Choose", "If you would like to hire this dealer for $" + dealer.hirePrice + "/hr reply to this message with 'hire'\nIf you would like to buy supply from this dealer ( $" + dealer.sellAmm + " for a " + product + " ) reply with 'buy'")
            .setColor('#008925')
            .setFooter('Dealer Finder');

        var message = msg.channel.send(embed)
        storage[msg.author.username].currentDealer.message = message
        storage.dealerId++
    },
};
