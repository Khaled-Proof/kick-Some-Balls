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
//const userdata = db.get('user-data');
const interact = require('interactjs');
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
mongoose.connect('mongodb://tsgd:27017/tsgd');
const path = require("path");
const Schema =mongoose.Schema;

const userdataSchema = new Schema({
Player1: {type:String},
Player2: {type:String},
Player3: {type:String},
Player4: {type:String},
time: {type:String},
team1: {type:Number},
team2: {type:Number},
},{collection:'user-data'});
const userdata=mongoose.model('Userdata',userdataSchema);

const playersSchema = new Schema({
    name: {type:String},
    time: {type:String},
},{collection:'players-data'});
const playersdata=mongoose.model('Playersdata',playersSchema);

//Data retrive with mongoose for this you do not need mongodb
router.get('/register', function(req, res, next) {
  res.render('index',{ title: 'giZn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );
});
router.get('/index', function(req, res, next) {
    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc){
            res.render('index',{players:doc,title: 'giZn&Khaled Kicker Project'});
        });
});
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'giZn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );
    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    playersdata.find().lean()
        .then(function (doc){
            res.render('index',{players:doc,title: 'giZen&Khaled Kicker Project'});
     });
});

router.get('/get-data', function (req, res, next) {
 // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
    Handlebars.registerHelper('selected', function(option, value){
        if (option === value) {
            return ' selected';
        } else {
            return ''
        }
    });
    userdata.find().lean()
    .then(function (doc){
      res.render('index',{item:doc,title: 'giZn&Khaled Kicker Project'});
    });
});

router.post('/insert', function(req, res, next) {
    const id = req.body.id;
    const  d = new Date();
    const datetime= d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + '-' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    const item = {
    Player1: req.body.Player1.toString().replace(",", ""),
    Player2: req.body.Player2.toString().replace(",", ""),
    Player3: req.body.Player3.toString().replace(",", ""),
    Player4: req.body.Player4.toString().replace(",", ""),
      time:datetime,
    team1: req.body.team1,
    team2: req.body.team2,
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

router.get('/update/:id',function (req,res,next){
  res.render('update',{output:req.params.id,title: 'giZn&Khaled Kicker Project'});
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

        .then(function (doc)
            res.render('history', {item: doc, title: 'giZn&Khaled Kicker Project',count1:count,won:totalwon,lost:totallose,wonpresent:wonperecent1,lospresent:losperecent1, condition: true,test1:name, array: [1, 2, 3, 4]});
        });
});



router.get('/charts',async function (req, res, next) {
//khaled start
    const finalResults = [];
    const wonResults = [];
    const lostResults = [];

    const Promise = playersdata.find({ }, async function (err, results) {
        for (const element of results) {
            console.log(element.name);
             name2 = element.name;
            finalResults.push(name2);

            const khaledwon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
            const khaledwon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name2 }, { Player4: name2 }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
            const khaledtotalwon= khaledwon1+khaledwon2;
            wonResults.push(khaledtotalwon);

            const khaledlose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: name2 }, { Player1: name2 }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
            const khaledlose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: name2 }, { Player4: name2 }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
            const khaledtotallose= (khaledlose1+khaledlose2);
            lostResults.push(-khaledtotallose);

            const khaledtotal =khaledtotallose+khaledtotalwon;

            console.log(khaledtotalwon)
            console.log(khaledtotal);

        }
        const wontot = JSON.stringify(finalResults)
      //  khaledwon:khaledtotalwon,khaledlost:khaledtotallose,totalg:khaledtotal,
        res.render('charts', {title: 'giZn&Khaled Kicker Project', condition: true, namearray: finalResults,wonarray:wonResults,lostarray:lostResults
        });


    });



/**
    const khaledwon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'Khaled' }, { Player1: 'Khaled' }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
    const khaledwon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'Khaled' }, { Player4: 'Khaled' }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
    const khaledtotalwon= khaledwon1+khaledwon2;

    const khaledlose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'Khaled' }, { Player1: 'Khaled' }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
    const khaledlose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'Khaled' }, { Player4: 'Khaled' }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
    const khaledtotallose= khaledlose1+khaledlose2;
    const khaledtotal =khaledtotallose+khaledtotalwon;
    //khaled end
**/
    //giZn start
    const giZnwon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'giZn' }, { Player1: 'giZn' }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
    const giZnwon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'giZn' }, { Player4: 'giZn' }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
    const giZntotalwon= giZnwon1+giZnwon2;

    const giZnlose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'giZn' }, { Player1: 'giZn' }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
    const giZnlose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'giZn' }, { Player4: 'giZn' }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
    const giZentotallose= giZnlose1+giZnlose2;
    //giZen end

    //Nico start
    const Nicowon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'Nico' }, { Player1: 'Nico' }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
    const Nicowon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'Nico' }, { Player4: 'Nico' }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
    const Nicototalwon= Nicowon1+Nicowon2;

    const Nicolose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'Nico' }, { Player1: 'Nico' }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
    const Nicolose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'Nico' }, { Player4: 'Nico' }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
    const Nicototallose= Nicolose1+Nicolose2;
    //Nico end
    //David start
    const Davidwon1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'David' }, { Player1: 'David' }]}, {$or: [{ $expr: { $gt: ['$team1', '$team2'] }}]}]});
    const Davidwon2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'David' }, { Player4: 'David' }]}, {$or: [{ $expr: { $gt: ['$team2', '$team1'] }}]}]});
    const Davidtotalwon= Davidwon1+Davidwon2;

    const Davidlose1 = await userdata.countDocuments({$and: [{$or: [{ Player2: 'David' }, { Player1: 'David' }]}, {$or: [{ $expr: { $lt: ['$team1', '$team2'] }}]}]});
    const Davidlose2 = await userdata.countDocuments({$and: [{$or: [{ Player3: 'David' }, { Player4: 'David' }]}, {$or: [{ $expr: { $lt: ['$team2', '$team1'] }}]}]});
    const Davidtotallose= Davidlose1+Davidlose2;
    //David end
  //  res.render('charts', { title: 'giZen&Khaled Kicker Project',khaledwon:khaledtotalwon,khaledlost:khaledtotallose,giZenwon:giZentotalwon,giZenlost:giZentotallose,Nicowon:Nicototalwon,Nicolost:Nicototallose,Davidwon:Davidtotalwon,Davidlost:Davidtotallose, condition: true, array: [1, 2, 3, 4]});


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
            res.render('register',{item:doc,title: 'giZen&Khaled Kicker Project'});
        });
});

router.post('/delete-player', function(req, res, next) {
    const id = req.body.id;
    //userdata.delete({'_id':db.id(id),item});
    playersdata.findByIdAndRemove(id).exec();
    res.redirect('/get-players');


});

/* GET home page. Data retive with mongodb

router.get('/index', function(req, res, next) {
  res.render('index',{ title: 'gizn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


});
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'gizn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


});

router.get('/get-data', function (req, res, next) {
const resultarray =[];
      mongo.connect(url, function (err, client) {
        const db = client.db('test')
        assert.equal(null, err);
        const cursor = db.collection('user-data').find();
        cursor.forEach(function (doc,err){
          assert.equal(null, err);
          resultarray.push(doc);
        },function (){
          // MongoClient.close(); should chck the connetion closing again
          res.render('index',{items:resultarray,title: 'gizn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );
        });
      });
    });




router.post('/insert', function(req, res, next) {
  const id = req.body.id;
  const  d = new Date();
  const datetime= d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
  let item = {
    Player1: req.body.Player1,
    Player2: req.body.Player2,
    Player3: req.body.Player3,
    Player4: req.body.Player4,
    time: datetime,
    team1: req.body.team1,
    team2: req.body.team2
  };

  mongo.connect(url,function (err, client) {
    const db = client.db('test')

    assert.equal(null,err);

    db.collection('user-data').insertOne(item,function (err,result){
      assert.equal(null,err);
      console.log('Item has been inserted');
     // MongoClient.close(); should chck the connetion closing again
    });
  });
    res.redirect('index' );

  });

router.post('/update', function(req, res, next) {
  let item = {
    player1: req.body.player1,
    player2: req.body.player2,
    player3: req.body.player3,
    player4: req.body.player4,
    team1: req.body.team1,
    team2: req.body.team2
  };
  const id = req.body.id;
  mongo.connect(url,function (err, client) {
    const db = client.db('test')

    assert.equal(null,err);

    db.collection('user-data').updateOne({"_id":mongoid(id)},{$set:item},function (err,result){
      assert.equal(null,err);
      console.log('Item has been updated');
      // MongoClient.close(); should chck the connetion closing again
      res.redirect('/get-data');

    });
  });

});
router.post('/delete', function(req, res, next) {
  const id = req.body.id;
  mongo.connect(url,function (err, client) {
    const db = client.db('test')

    assert.equal(null,err);

    db.collection('user-data').deleteOne({"_id":mongoid(id)},function (err,result){
      assert.equal(null,err);
      console.log('Item has been deleted');
      res.redirect('/get-data');
      // MongoClient.close(); should chck the connetion closing again
    });
  });

});

router.get('/update/:id',function (req,res,next){
  res.render('update',{output:req.params.id});
});



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form Validation',success:req.session.success,errors:req.session.errors});
  req.session.errors=null;
  req.session.success=null;

});
router.post('/submit',function (req,res,next){
  //check validity (validator link) https://github.com/validatorjs/validator.js#validators
req.check('email','Invalid E-Mail Form').isEmail();
req.check('password','Passowrd is not valid or not matching').isLength({min:4}).equals(req.body.confirmpassword);
const errors= req.validationErrors();
if(errors){
  req.session.errors=errors;
  req.session.success =false;
}else{
  req.session.success =true;

}
  res.redirect('/');
});


/* pass parametre to the url
router.get('/', function(req, res, next) {
  res.render('index', { title: 'G&K Tablesoccer Project',condition:true,array:[1,2,3,4] });
});
router.get('/test/:id',function (req,res,next){
  res.render('test',{output:req.params.id});
});
*/
/*post a value and redirect
router.post('/test/submit',function (req,res,next){
var id = req.body.id;
  res.redirect('/test/'+id);
});
*/




module.exports = router;
