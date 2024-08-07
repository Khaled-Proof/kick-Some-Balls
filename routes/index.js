const express = require('express');
const router = express.Router();
const assert = require('assert');
const chart = require('chart.js');
const {CanvasRenderService} = require('chartjs-node-canvas');
const inetract = require('interact.js');
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const path = require("path");
const BaseUrl = "http://tsgd:9000";
mongoose.connect('mongodb://tsgd:27017/tsgd');
const Schema = mongoose.Schema;

const userdataSchema = new Schema({
    Player1: {type: String},
    Player2: {type: String},
    Player3: {type: String},
    Player4: {type: String},
    time: {type: Date},
    team1: {type: Number},
    team2: {type: Number},
    matchid: {type: Number},
    duration: {type: String, default: null},
}, {collection: 'user-data'});
const userdata = mongoose.model('Userdata', userdataSchema);

const playersSchema = new Schema({
    name: {type: String}, time: {type: String},
}, {collection: 'players-data'});
const playersdata = mongoose.model('Playersdata', playersSchema);

//gamer Schema
const gamersSchema = new Schema({
    name: {type: String},
}, {collection: 'gamers'});
const gamers = mongoose.model('gamers', gamersSchema);

//function to implement the matchid logic
async function get_matchid() {
    const last_matchid_query = await userdata.find({}).select('matchid -_id').sort({'time': -1}).lean().limit(1).then();
    const last_matchid = JSON.parse(last_matchid_query[0]['matchid']);
    //console.log('last_matchid:', last_matchid);
    const matches = await userdata.find({'matchid': last_matchid}).sort({'time': -1}).lean().then();
    const team1_won = await userdata.find({'matchid': last_matchid}).sort({'time': -1}).lean().countDocuments({$expr: {$gt: ['$team1', '$team2']}});
    const team2_won = await userdata.find({'matchid': last_matchid}).sort({'time': -1}).lean().countDocuments({$expr: {$gt: ['$team2', '$team1']}});
    //console.log(team1_won, team2_won)
    matchid = last_matchid;
    if (matches.length >= 2 && team1_won == 2 || team2_won == 2) {
        matchid++;
    }
    console.log("matchid:", matchid)
    return matchid;
}

//Data retrive with mongoose for this you do not need mongodb
router.get('/register', function (req, res, next) {

    res.render('register', {title: 'gizn&Khaled Kicker Project', condition: true, array: [1, 2, 3, 4]});

});
router.get('/index', function (req, res, next) {

    //const matchid = get_matchid();

    Handlebars.registerHelper('selected', function (option, value) {
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc) {
            res.render('index', {players: doc, title: 'gizn&Khaled Kicker Project'});

        });

});
router.get('/', async function (req, res, next) {

    //const matchid = get_matchid();

    Handlebars.registerHelper('selected', function (option, value) {
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc) {
            res.render('index', {players: doc, title: 'gizn&Khaled Kicker Project'});

        });


});

router.get('/get-data', function (req, res, next) {

    //const matchid = get_matchid();
    // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
    Handlebars.registerHelper('selected', function (option, value) {
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    userdata.find().sort({time: -1}).lean()
        .then(function (doc) {
            res.render('index', {item: doc, title: 'gizn&Khaled Kicker Project'});
        });


});

router.post('/insert', async function (req, res, next) {

    const id = req.body.id;
    const d = new Date();
    const datetime = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    const item = {
        Player1: req.body.Player1.toString().replace(",", ""),
        Player2: req.body.Player2.toString().replace(",", ""),
        Player3: req.body.Player3.toString().replace(",", ""),
        Player4: req.body.Player4.toString().replace(",", ""),
        time: datetime,
        team1: req.body.team1,
        team2: req.body.team2, // matchid:matchid,
        duration: req.body.duration,
    };
    const data = new userdata(item);
    data.save();
    res.redirect('index');
});


router.post('/update', function (req, res, next) {

    const id = req.body.id;
    userdata.findById(id, function (err, doc) {
        if (err) {
            console.error('no entry found');
        }
        doc.Player1 = req.body.Player1.toString().replace(",", "");
        doc.Player2 = req.body.Player2.toString().replace(",", "");
        doc.Player3 = req.body.Player3.toString().replace(",", "");
        doc.Player4 = req.body.Player4.toString().replace(",", "");
        doc.team1 = req.body.team1;
        doc.team2 = req.body.team2;
        doc.save();
    });
    //the id turn any id to object
    res.redirect('/index');

});
router.post('/delete', function (req, res, next) {
    const id = req.body.id;
    //userdata.delete({'_id':db.id(id),item});
    userdata.findByIdAndRemove(id).exec();
    res.redirect('/get-data');


});

router.get('/update/:id', async function (req, res, next) {
    const id = req.params.id;

    userdata.findById(id, function (err, doc) {
        if (err) {
            console.error('no entry found');
        }
        p1 = doc.Player1;
        p2 = doc.Player2;
        p3 = doc.Player3;
        p4 = doc.Player4;
        t1 = doc.team1;
        t2 = doc.team2;

        res.render('update', {
            item1: p1,
            item2: p2,
            item3: p3,
            item4: p4,
            item5: t1,
            item6: t2,
            item: doc,
            output: req.params.id,
            title: 'gizn&Khaled Kicker Project'
        });
    });
    // res.render('update',{output:req.params.id,output1:doc.Player1,title: 'gizn&Khaled Kicker Project'});
});

router.get('/reinsert/:id', async function (req, res, next) {
    const id = req.params.id;

    userdata.findById(id, function (err, doc) {
        if (err) {
            console.error('no entry found');
        }
        p1 = doc.Player1;
        p2 = doc.Player2;
        p3 = doc.Player3;
        p4 = doc.Player4;
        res.render('reinsert', {
            item1: p1,
            item2: p2,
            item3: p3,
            item4: p4,
            item: doc,
            output: req.params.id,
            title: 'gizn&Khaled Kicker Project'
        });
    });
    // res.render('update',{output:req.params.id,output1:doc.Player1,title: 'gizn&Khaled Kicker Project'});
});

router.post('/reinsert', async function (req, res, next) {

    const id = req.body.id;
    const d = new Date();
    const datetime = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    const item = {
        Player1: req.body.Player1.toString().replace(",", ""),
        Player2: req.body.Player2.toString().replace(",", ""),
        Player3: req.body.Player3.toString().replace(",", ""),
        Player4: req.body.Player4.toString().replace(",", ""),
        time: datetime,
        team1: req.body.team1,
        team2: req.body.team2, //matchid:matchid,
    };


    const data = new userdata(item);
    data.save();

    res.redirect('index');


});

router.get('/history/:Player2', async function (req, res, next) {
    const Handlebars = require('handlebars');
    Handlebars.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
    });
    const name = req.params.Player2;
    const count = await userdata.countDocuments({$or: [{Player1: name}, {Player2: name}, {Player3: name}, {Player4: name}]});

    const won1 = await userdata.countDocuments({$and: [{$or: [{Player2: name}, {Player1: name}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}]});
    const won2 = await userdata.countDocuments({$and: [{$or: [{Player3: name}, {Player4: name}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}]});
    const totalwon = won1 + won2;

    const lose1 = await userdata.countDocuments({$and: [{$or: [{Player2: name}, {Player1: name}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}]});
    const lose2 = await userdata.countDocuments({$and: [{$or: [{Player3: name}, {Player4: name}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}]});
    const totallose = lose1 + lose2;
    const wonperecent1 = (totalwon / (totalwon + totallose)) * 100;
    const losperecent1 = (totallose / (totalwon + totallose)) * 100;


    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifCond1', function (v1, v2, options) {
        if (v1 > v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    userdata.find({$or: [{Player1: name}, {Player2: name}, {Player3: name}, {Player4: name}]}).lean()

        .then(function (doc) {
            res.render('history', {
                item: doc,
                title: 'gizn&Khaled Kicker Project',
                count1: count,
                won: totalwon,
                lost: totallose,
                wonpresent: wonperecent1,
                lospresent: losperecent1,
                condition: true,
                test1: name,
                array: [1, 2, 3, 4]
            });
        });
});


router.post('/charts', async function (req, res, next) {
//khaled start
    const date = req.body.time;

    const finalResults = [];
    const wonResults = [];
    const lostResults = [];
    const persentagew = [];
    const persentagel = [];
    const totalplayed = [];
    const n2names = [];
    const n3names = [];
    const p23wons = [];
    const p23los = [];
    const p23lw = [];
    const strich = [];
    const stricher = [];
    const teamstrich = [];
    const uniqstriche = [];
    const dates = [];
    const wlratio = [];

    const Promise = playersdata.find({}, async function (err, results) {
        for (const element of results) {
            let name2 = element.name;
            finalResults.push(name2);

            //generic game stats
            const gameswon_team1 = await userdata.countDocuments({$and: [{$or: [{Player2: name2}, {Player1: name2}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
            const gameswon_team2 = await userdata.countDocuments({$and: [{$or: [{Player3: name2}, {Player4: name2}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
            const strich1 = await userdata.countDocuments({$and: [{$or: [{Player2: name2}, {Player1: name2}]}, {$expr: {$eq: ['$team2', '0']}}, {$expr: {$gt: ['$time', date]}}]});
            const strich2 = await userdata.countDocuments({$and: [{$or: [{Player3: name2}, {Player4: name2}]}, {$expr: {$eq: ['$team1', '0']}}, {$expr: {$gt: ['$time', date]}}]});
            // const strichmate = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, { $expr: { $eq: ['$team2', '0'] }}]});

            const strichtotal = strich1 + strich2;
            stricher.push(name2)
            strich.push(strichtotal);

            const gamestotalwon = gameswon_team1 + gameswon_team2;
            wonResults.push(gamestotalwon);

            const gameslost_team1 = await userdata.countDocuments({$and: [{$or: [{Player2: name2}, {Player1: name2}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
            const gameslost_team2 = await userdata.countDocuments({$and: [{$or: [{Player3: name2}, {Player4: name2}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
            const gamestotallost = (gameslost_team1 + gameslost_team2);
            lostResults.push(-gamestotallost);

            const wonpers = (gamestotalwon / (gamestotalwon + gamestotallost)) * 100;
            persentagew.push(wonpers.toFixed(1));
            const lostpers = (gamestotallost / (gamestotalwon + gamestotallost)) * 100;
            persentagel.push(lostpers.toFixed(1));

            const tota = gamestotalwon + gamestotallost;
            totalplayed.push(tota);
            const ratio=gamestotalwon/gamestotallost;
            wlratio.push(ratio);
            for (const element1 of results) {
                let name3 = element1.name;
                if (name2 != name3) {
                    n23 = name2 + ' & ' + name3;

                    // n3names.push(name3);
                    const spielewon1 = await userdata.countDocuments({$and: [{$and: [{Player2: name2}, {Player1: name3}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielewon2 = await userdata.countDocuments({$and: [{$and: [{Player1: name2}, {Player2: name3}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielewon3 = await userdata.countDocuments({$and: [{$and: [{Player3: name2}, {Player4: name3}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielewon4 = await userdata.countDocuments({$and: [{$and: [{Player4: name2}, {Player3: name3}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const gesamtwin = spielewon1 + spielewon2 + spielewon3 + spielewon4;


                    const spielelos1 = await userdata.countDocuments({$and: [{$and: [{Player2: name2}, {Player1: name3}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielelos2 = await userdata.countDocuments({$and: [{$and: [{Player1: name2}, {Player2: name3}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielelos3 = await userdata.countDocuments({$and: [{$and: [{Player3: name2}, {Player4: name3}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const spielelos4 = await userdata.countDocuments({$and: [{$and: [{Player4: name2}, {Player3: name3}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}, {$expr: {$gt: ['$time', date]}}]});
                    const gesamtlos = spielelos1 + spielelos2 + spielelos3 + spielelos4;


                    const lwtotal = gesamtlos + gesamtwin;
                    if (lwtotal != 0) {
                        p23lw.push(lwtotal);
                        n2names.push(n23);
                        p23wons.push(gesamtwin);
                        p23los.push(gesamtlos);
                    }


                    //Team Striche
                    const teamstrich1 = await userdata.find({$and: [{$and: [{Player2: name2}, {Player1: name3}]}, {$expr: {$eq: ['$team2', '0']}}, {$expr: {$gt: ['$time', date]}}]});
                    const teamstrich2 = await userdata.find({$and: [{$and: [{Player1: name2}, {Player2: name3}]}, {$expr: {$eq: ['$team2', '0']}}, {$expr: {$gt: ['$time', date]}}]});
                    const teamstrich3 = await userdata.find({$and: [{$and: [{Player3: name2}, {Player4: name3}]}, {$expr: {$eq: ['$team1', '0']}}, {$expr: {$gt: ['$time', date]}}]});
                    const teamstrich4 = await userdata.find({$and: [{$and: [{Player4: name2}, {Player3: name3}]}, {$expr: {$eq: ['$team1', '0']}}, {$expr: {$gt: ['$time', date]}}]});
                    const totalstriche = [teamstrich1, teamstrich2, teamstrich3, teamstrich4]
                    // const le =Object.values(totalstriche);
                    totalstriche.forEach(time => {
                        for (let key in time) {
                            if (date) {
                                if (new Date(time[key].time) > new Date(date)) {
                                    teamstrich.push(time[key].Player1 + ' & ' + time[key].Player2 + ' VS ' + time[key].Player3 + ' & ' + time[key].Player4 + '\n' + time[key].team1 + '-' + time[key].team2 + '\n' + ' ' + '\n')
                                }
                            } else {
                                teamstrich.push(time[key].Player1 + ' & ' + time[key].Player2 + ' VS ' + time[key].Player3 + ' & ' + time[key].Player4 + '\n' + time[key].team1 + '-' + time[key].team2 + '\n' + ' ' + '\n')
                            }

                        }
                        teamstrich.forEach(function (item) {
                            if (uniqstriche.indexOf(item) < 0) {
                                uniqstriche.push(item);
                            }
                        });
                    })


                }
            }
        }
        const totaldates = await userdata.find({time: {$gt: date}});
        for (let key in totaldates) {
            dates.push((totaldates[key].time).toLocaleString());
        }


        const wontot = JSON.stringify(finalResults)
        playersdata.find().lean()
            .then(function (doc) {
                res.render('charts', {
                    item: doc,
                    title: 'gizn&Khaled Kicker Project',
                    condition: true,
                    namearray: finalResults,
                    wonarray: wonResults,
                    lostarray: lostResults,
                    wper: persentagew,
                    lper: persentagel,
                    total: totalplayed,
                    pn2: n2names,
                    gwin: p23wons,
                    glos: p23los,
                    glw: p23lw,
                    st: strich,
                    stt: uniqstriche,
                    date: date,
                    wl: wlratio,
                    dates: dates
                });
                //  khaledwon:khaledtotalwon,khaledlost:khaledtotallose,totalg:khaledtotal,
            });


    });


});


router.post('/register', function (req, res, next) {
    // const id = req.body.id;
    const d = new Date();
    const datetime = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

    const players = {
        name: req.body.name, time: datetime,
    };
    const data = new playersdata(players);
    data.save();

    res.redirect('get-players');

});

//register a gamer
router.post('/registergamer', function (req, res, next) {
    // const id = req.body.id;

    const players = {
        name: req.body.gamer,
    };
    const data = new gamers(players);
    data.save();

    res.redirect('get-players');

});

//Gamer functions
function generateUniquePairs(players) {
    const pairs = [];

    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i + 1; j < players.length; j++) {
            pairs.push([players[i].name, players[j].name]);
        }
    }

    return pairs;
}

// Function to create matches from unique pairs
function createMatches(uniquePairs) {
    const matches = [];

    while (uniquePairs.length > 0) {
        const team1 = uniquePairs.shift();
        const team2Index = uniquePairs.findIndex(pair => !pair.some(player => team1.includes(player)));

        if (team2Index !== -1) {
            const team2 = uniquePairs.splice(team2Index, 1)[0];
            matches.push(`${team1.join(' & ')} vs ${team2.join(' & ')}`);
        }
    }

    return matches;
}

router.get('/creatematches', function (req, res, next) {
    // Fetch players from MongoDB using Mongoose
    gamers.find({}, 'name').lean().exec(function (err, players) {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching players data');
        } else {
            const uniquePairs = generateUniquePairs(players);
            const matches = createMatches(uniquePairs);
            res.render('index', {items: matches, title: 'Gizn & Khaled Kicker Project'});
        }
    });
});

router.get('/get-players', function (req, res, next) {
    // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
    playersdata.find().lean()
        .then(function (doc) {
            res.render('register', {item: doc, title: 'gizn&Khaled Kicker Project'});
        });
});

//Gamer funktions
function generateUniquePairs(players) {
    const pairs = [];

    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i + 1; j < players.length; j++) {
            pairs.push([players[i].name, players[j].name]);
        }
    }

    return pairs;
}

// Function to create matches from unique pairs
function createMatches(uniquePairs) {
    const matches = [];

    while (uniquePairs.length > 0) {
        const team1 = uniquePairs.shift();
        const team2Index = uniquePairs.findIndex(pair => !pair.some(player => team1.includes(player)));

        if (team2Index !== -1) {
            const team2 = uniquePairs.splice(team2Index, 1)[0];
            matches.push(`${team1.join(' & ')} vs ${team2.join(' & ')}`);
        }
    }

    return matches;
}

router.get('/creatematches', function (req, res, next) {
    // Fetch players from MongoDB using Mongoose
    gamers.find({}, 'name').lean().exec(function (err, players) {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching players data');
        } else {
            const uniquePairs = generateUniquePairs(players);
            const matches = createMatches(uniquePairs);
            res.render('index', {items: matches, title: 'Gizn & Khaled Kicker Project'});
        }
    });
});


// in dieser Funktion kann man einen Spieler löschen
//* start of delete
router.post('/delete-player', function (req, res, next) {
    const id = req.body.id;
    //userdata.delete({'_id':db.id(id),item});
    playersdata.findByIdAndRemove(id).exec();
    res.redirect('/get-players');


});
//* end  of delete


module.exports = router;
