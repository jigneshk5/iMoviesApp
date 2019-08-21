const express = require('express');
const app = express();
// Import csvtojson module
const csv = require('csvtojson');
// Import Mongodb
const mongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Mongodb Connection URL 
const url = 'mongodb://jigneshk5:jignesh12345@ds147225.mlab.com:47225/parkingdb';

// Use connect method to connect to the Server
mongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  var dbase = db.db("parkingdb");
  console.log("Connected correctly to Database");
  var collection= dbase.collection('movies');
  const csvFilePath = './movieData.csv';

  csv({
    colParser:{
		"MOVIE_ID":"number",
        "RATING":"number",
        "TOTAL_VOTES":"number"
	},
    noheader: true,
	headers: ['MOVIE_ID','TITLE','RATING','TOTAL_VOTES','GENRE1','GENRE2','GENRE3','META_CRITIC','BUDGET','RUNTIME']
  })
    .fromFile(csvFilePath)
    .on('error',(err)=>{
        console.log(err);
    })
    .on('done',(error)=>{
        console.log('completed');
    })
    .then( (jsonObjArr) => {
        collection.insert(jsonObjArr, function(err, res) {  
            if (err) throw err;  
            console.log("Number of records inserted: " + res.insertedCount);  
            db.close();  
            });  
    })
    .catch( (error) => {
      console.log(error);
    });
});