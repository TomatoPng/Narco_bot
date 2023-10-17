const express = require('express');
const s = express();

var serverData = {
    userData: [
        {
            id: "",
            name: "",
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
        }
    ]
};

s.use(express.json()); // Add this line to parse the request body as JSON

s.get('/data', (req, res) => {
    if (serverData) {
        res.json({ data: serverData });
    } else {
        res.status(404).json({ error: 'No data found' });
    }
});

s.post('/data', (req, res) => {
    serverData = req.body;
    res.json({ message: 'Data stored successfully' });
});

const port = 4200;
s.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});