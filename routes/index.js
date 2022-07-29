const express = require('express');
const router = express.Router();
//const mongo = require('mongodb');
const assert = require('assert');
//const {ObjectId} = require("mongodb");
//const {MongoClient} = require("mongodb");
//const mongo = require('mongodb').MongoClient;
//const mongoid = require('mongodb').ObjectId;
const chart =require('chart.js');
const {CanvasRenderService} = require('chartjs-node-canvas');
//const db = require('monk')('localhost:27017/test')
//const userdata = db.get('user-data');
const inetract = require('interact.js');

//const url = 'mongodb://localhost:27017/test'
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const path = require("path");
mongoose.connect('mongodb://tsgd:27017/tsgd');
const Schema =mongoose.Schema;

const userdataSchema = new Schema({
    Player1: {type:String},
    Player2: {type:String},
    Player3: {type:String},
    Player4: {type:String},
    time: {type:Date},
    team1: {type:Number},
    team2: {type:Number},
    matchid: {type:Number},
},{collection:'user-data'});
const userdata=mongoose.model('Userdata',userdataSchema);

const playersSchema = new Schema({
    name: {type:String},
    time: {type:String},
},{collection:'players-data'});
const playersdata=mongoose.model('Playersdata',playersSchema);

//function to implement the matchid logic
async function get_matchid(){
    const last_matchid_query = await userdata.find({}).select('matchid -_id').sort({'time': -1}).lean().limit(1).then();
    const last_matchid = JSON.parse(last_matchid_query[0]['matchid']);
    //console.log('last_matchid:', last_matchid);
    const matches = await userdata.find({'matchid': last_matchid}).sort({'time'  : -1}).lean().then();
    const team1_won = await userdata.find({'matchid': last_matchid}).sort({'tim  e': -1}).lean().countDocuments({ $expr: { $gt: ['$team1', '$team2']}});
    const team2_won = await userdata.find({'matchid': last_matchid}).sort({'tim  e': -1}).lean().countDocuments({ $expr: { $gt: ['$team2', '$team1']}});
    //console.log(team1_won, team2_won)
    matchid = last_matchid;
    if (matches.length >= 2 && team1_won == 2 || team2_won == 2) {
        matchid++;
    }
    console.log("matchid:", matchid)
    return matchid;
}

//Data retrive with mongoose for this you do not need mongodb
router.get('/register', function(req, res, next) {

    res.render('register',{ title: 'gizn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );

});
router.get('/index', function(req, res, next) {

    const matchid = get_matchid();

    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc){
            res.render('index',{players:doc,title: 'gizn&Khaled Kicker Project'});

        });

});
router.get('/', async function(req, res, next) {

    const matchid = get_matchid();

    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc){
            res.render('index',{players:doc,title: 'gizn&Khaled Kicker Project'});

        });


});

router.get('/get-data', function (req, res, next) {

    const matchid = get_matchid();
    // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    userdata.find().sort({time:-1}).lean()
        .then(function (doc){
            res.render('index',{item:doc,title: 'gizn&Khaled Kicker Project'});
        });


});

router.post('/insert', async function(req, res, next) {

    const id = req.body.id;
    const  d = new Date();
    const datetime = new Date(d.getTime() -(d.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    const item = {
        Player1: req.body.Player1.toString().replace(",", ""),
        Player2: req.body.Player2.toString().replace(",", ""),
        Player3: req.body.Player3.toString().replace(",", ""),
        Player4: req.body.Player4.toString().replace(",", ""),
        time:datetime,
        team1: req.body.team1,
        team2: req.body.team2,
        matchid:matchid,
    };
    const data=new userdata(item);
    data.save();
    res.redirect('index' );
});

router.post('/update', function(req, res, next) {

    const id = req.body.id;
    userdata.findById(id,function (err,doc){
        if(err){
            console.error('no entry found');
        }
        doc.Player1= req.body.Player1.toString().replace(",", "");
        doc.Player2= req.body.Player2.toString().replace(",", "");
        doc.Player3= req.body.Player3.toString().replace(",", "");
        doc.Player4= req.body.Player4.toString().replace(",", "");
        doc.team1= req.body.team1;
        doc.team2= req.body.team2;
        doc.save();
    });
    //the id turn any id to object
    res.redirect('/index');

});
router.post('/delete', function(req, res, next) {
    const id = req.body.id;
    //userdata.delete({'_id':db.id(id),item});
    userdata.findByIdAndRemove(id).exec();
    res.redirect('/get-data');


});

router.get('/update/:id',async function (req, res, next) {
    const id = req.params.id;

    userdata.findById(id, function (err, doc) {
        if (err) {
            console.error('no entry found');
        }
        p1=doc.Player1;
        p2=doc.Player2;
        p3=doc.Player3;
        p4=doc.Player4;
        t1=doc.team1;
        t2=doc.team2;

        res.render('update', {item1:p1,item2:p2,item3:p3,item4:p4,item5:t1,item6:t2,item: doc, output: req.params.id, title: 'gizn&Khaled Kicker Project'});
    });
    // res.render('update',{output:req.params.id,output1:doc.Player1,title: 'gizn&Khaled Kicker Project'});
});

router.get('/reinsert/:id',async function (req, res, next) {
    const id = req.params.id;

    userdata.findById(id, function (err, doc) {
        if (err) {
            console.error('no entry found');
        }
        p1=doc.Player1;
        p2=doc.Player2;
        p3=doc.Player3;
        p4=doc.Player4;
        res.render('reinsert', {item1:p1,item2:p2,item3:p3,item4:p4,item: doc, output: req.params.id, title: 'gizn&Khaled Kicker Project'});
    });
    // res.render('update',{output:req.params.id,output1:doc.Player1,title: 'gizn&Khaled Kicker Project'});
});

router.post('/reinsert',async function(req, res, next) {

    const id = req.body.id;
    const  d = new Date();
    const datetime = new Date(d.getTime() -(d.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    const item = {
        Player1: req.body.Player1.toString().replace(",", ""),
        Player2: req.body.Player2.toString().replace(",", ""),
        Player3: req.body.Player3.toString().replace(",", ""),
        Player4: req.body.Player4.toString().replace(",", ""),
        time:datetime,
        team1: req.body.team1,
        team2: req.body.team2,
        matchid:matchid,
    };


    const data=new userdata(item);
    data.save();

    res.redirect('index' );


});

router.get('/history/:Player2',async function (req, res, next) {
    const Handlebars = require('handlebars');
    Handlebars.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
    });
    const name = req.params.Player2;
    const count = await userdata.countDocuments({$or: [{Player1: name}, {Player2: name}, {Player3: name}, {Player4: name}]});

    const won1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name }, { Player1: name }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
    const won2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name }, { Player4: name }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
    const totalwon= won1+won2;

    const lose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name }, { Player1: name }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
    const lose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name }, { Player4: name }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
    const totallose= lose1+lose2;
    const wonperecent1 = (totalwon/(totalwon+totallose))*100;
    const losperecent1 = (totallose/(totalwon+totallose))*100;




    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifCond1', function(v1, v2, options) {
        if(v1> v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    userdata.find({$or: [{Player1: name}, {Player2: name}, {Player3: name}, {Player4: name}]}).lean()

        .then(function (doc) {
            res.render('history', {item: doc, title: 'gizn&Khaled Kicker Project',count1:count,won:totalwon,lost:totallose,wonpresent:wonperecent1,lospresent:losperecent1, condition: true,test1:name, array: [1, 2, 3, 4]});
        });

});



router.get('/charts',async function (req, res, next) {
//khaled start
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
    const wlratio = [];


    const Promise = playersdata.find({ }, async function (err, results) {
        for (const element of results) {
           // console.log(element.name);
            let name2 = element.name;
            finalResults.push(name2);

            const khaledwon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
            const khaledwon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name2 }, { Player4: name2 }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
            const strich1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, { $expr: { $eq: ['$team2', '0'] }}]});
            const strich2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name2 }, { Player4: name2 }]}, { $expr: { $eq: ['$team1', '0'] }}]});
            const strichtotal=strich1+strich2;
            strich.push(strichtotal);

            const khaledtotalwon= khaledwon1+khaledwon2;
            wonResults.push(khaledtotalwon);

            const khaledlose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
            const khaledlose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name2 }, { Player4: name2 }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
            const khaledtotallose= (khaledlose1+khaledlose2);
            lostResults.push(-khaledtotallose);


            const khaledtotal =khaledtotallose+khaledtotalwon;
            const wonpers=(khaledtotalwon/(khaledtotalwon+khaledtotallose))*100;
            persentagew.push(wonpers.toFixed(1));
            const lostpers=(khaledtotallose/(khaledtotalwon+khaledtotallose))*100;
            persentagel.push(lostpers.toFixed(1));

            const tota=khaledtotalwon+khaledtotallose;
            totalplayed.push(tota);

            const ratio=khaledtotalwon/khaledtotallose;
            wlratio.push(ratio);

           // console.log(khaledtotalwon)
           // console.log(khaledtotal);
            for (const element1 of results) {
                let name3 = element1.name;
                if(name2 !=name3) {
                    n23=name2+' & '+name3;
                    n2names.push(n23);
                   // n3names.push(name3);
                    const spielewon1 = await userdata.countDocuments({$and: [{$and: [{Player2: name2}, {Player1: name3}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}]});
                    const spielewon2 = await userdata.countDocuments({$and: [{$and: [{Player1: name2}, {Player2: name3}]}, {$or: [{$expr: {$gt: ['$team1', '$team2']}}]}]});
                    const spielewon3 = await userdata.countDocuments({$and: [{$and: [{Player3: name2}, {Player4: name3}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}]});
                    const spielewon4 = await userdata.countDocuments({$and: [{$and: [{Player4: name2}, {Player3: name3}]}, {$or: [{$expr: {$gt: ['$team2', '$team1']}}]}]});
                    const gesamtwin=spielewon1+spielewon2+spielewon3+spielewon4;
                    p23wons.push(gesamtwin);

                    const spielelos1 = await userdata.countDocuments({$and: [{$and: [{Player2: name2}, {Player1: name3}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}]});
                    const spielelos2 = await userdata.countDocuments({$and: [{$and: [{Player1: name2}, {Player2: name3}]}, {$or: [{$expr: {$lt: ['$team1', '$team2']}}]}]});
                    const spielelos3 = await userdata.countDocuments({$and: [{$and: [{Player3: name2}, {Player4: name3}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}]});
                    const spielelos4 = await userdata.countDocuments({$and: [{$and: [{Player4: name2}, {Player3: name3}]}, {$or: [{$expr: {$lt: ['$team2', '$team1']}}]}]});
                    const gesamtlos=spielelos1+spielelos2+spielelos3+spielelos4;
                    p23los.push(gesamtlos);

                    const lwtotal=gesamtlos+gesamtwin;
                    p23lw.push(lwtotal);

                   // console.log(gesamtwin);
                }

            }
        }
        const wontot = JSON.stringify(finalResults)
        playersdata.find().lean()
            .then(function (doc){
                res.render('charts', {item:doc,title: 'gizn&Khaled Kicker Project', condition: true, namearray: finalResults,wonarray:wonResults,lostarray:lostResults,wper:persentagew,lper:persentagel,total:totalplayed,wl:wlratio,pn2:n2names,gwin:p23wons,glos:p23los,glw:p23lw,st:strich
            });
        //  khaledwon:khaledtotalwon,khaledlost:khaledtotallose,totalg:khaledtotal,
        });
    });
});


router.post('/register', function(req, res, next) {
    // const id = req.body.id;
    const  d = new Date();
    const datetime= d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

    const players = {
        name: req.body.name,
        time:datetime,
    };
    const data=new playersdata(players);
    data.save();

    res.redirect('get-players' );

});

router.get('/get-players', function (req, res, next) {
    // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
    playersdata.find().lean()
        .then(function (doc){
            res.render('register',{item:doc,title: 'gizn&Khaled Kicker Project'});
        });
});

// in dieser Funktion kann man einen Spieler löschen
//* start of delete
router.post('/delete-player', function(req, res, next) {
    const id = req.body.id;
    //userdata.delete({'_id':db.id(id),item});
    playersdata.findByIdAndRemove(id).exec();
    res.redirect('/get-players');


});
//* end  of delete




module.exports = router;
