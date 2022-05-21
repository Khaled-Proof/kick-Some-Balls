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
const Schema =mongoose.Schema;

const userdataSchema = new Schema({
Player1: {type:String},
Player2: {type:String},
Player3: {type:String},
Player4: {type:String},
time: {type:String},
team1: {type:String},
team2: {type:String},
},{collection:'user-data'});
const userdata=mongoose.model('Userdata',userdataSchema);

//Data retrive with mongoose for this you do not need mongodb
router.get('/index', function(req, res, next) {

  res.render('index',{ title: 'giZn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


});
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'giZn&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


});

router.get('/get-data', function (req, res, next) {
 // in the line belwo you can write the condtions of the data you wanna retrive in dthe finde funtion
userdata.find().lean()
    .then(function (doc){
      res.render('index',{item:doc,title: 'giZn&Khaled Kicker Project'});
    });
});

router.post('/insert', function(req, res, next) {
    const id = req.body.id;
    const  d = new Date();
    const datetime= d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();

    const item = {
    Player1: req.body.Player1,
    Player2: req.body.Player2,
    Player3: req.body.Player3,
    Player4: req.body.Player4,
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
        doc.Player1= req.body.Player1;
        doc.Player2= req.body.Player2;
        doc.Player3= req.body.Player3;
        doc.Player4= req.body.Player4;
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

router.get('/charts/:Player2',async function (req, res, next) {
    const Handlebars = require('handlebars');
    Handlebars.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
    });
    const name = req.params.Player2;
    const count = await userdata.countDocuments({$or: [{Player1: name}, {Player2: name}, {Player3: name}, {Player4: name}]});

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
            res.render('charts', {item: doc, title: 'giZen&Khaled Kicker Project',count1:count, condition: true,test1:name, array: [1, 2, 3, 4]});
        });

});

/* GET home page. Data retive with mongodb

router.get('/index', function(req, res, next) {
  res.render('index',{ title: 'giZen&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


});
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'giZen&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );


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
          res.render('index',{items:resultarray,title: 'giZen&Khaled Kicker Project',condition:true,array:[1,2,3,4] } );
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
