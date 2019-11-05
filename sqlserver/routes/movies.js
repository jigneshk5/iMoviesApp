const express = require('express');
var con = require('../models/dbschema.js');
const router = express.Router();


 /* Returns all movies from database  */
router.get('/', (req, res) => {
  let sql = `SELECT * FROM movies`;
  con.query(sql, (error, result, fields) => {
    if (error) {
      res.status(400).json({"error":error.message});
      return;
    }
    result.forEach(function(v){ delete v.poster_url });
    res.send(result);
  });
});
router.get('/filter', (req, res) => {
  var sql,val,ask,data,data1;
  let query = [req.query.MOVIE_ID,req.query.TITLE,req.query.RATING,req.query.TOTAL_VOTES,req.query.GENRE1,
    req.query.GENRE2,req.query.GENRE3,req.query.META_CRITIC,req.query.BUDGET,req.query.RUNTIME];
  let query1= req.query.genre;
  let b = ['MOVIE_ID','TITLE','RATING','TOTAL_VOTES','GENRE1','GENRE2','GENRE3','META_CRITIC','BUDGET','RUNTIME'];
  for(let i=0;i<10;i++){
    if(query[i]!=null){
      data=query[i];
      ask=b[i];
      data1=query1;
      if(query[i]=='GENRE1' || query[i]=='GENRE2' || query[i]=='GENRE3'){
        data1=null;
      }
      if(ask=='BUDGET'){
        if(query[i].charAt(0)!='$')
          data='$'.concat(new Intl.NumberFormat('en-US',{maximumFractionDigits:0 }, { style: 'currency', currency: 'USD'}).format(query[i]))
          //console.log(data);
      }
      if(ask=='RUNTIME'){
        if(query[i].split(" ").pop()!='min')
          data= query[i].split(" ")[0]+' min';
          //console.log(data);
      }
    }    
  }
  let placeholders = ask+' = ? ';
  if(data1==null){
    sql = `SELECT * FROM movies WHERE ${placeholders} `;
    val=[data];
  }
  else{
    sql = `SELECT * FROM movies WHERE ${placeholders} AND ( GENRE1=? OR GENRE2=? OR GENRE3=? )`;
    val= [data,data1,data1,data1]
  }
  con.query(sql, val ,function (err, result) {
    if (err) {
      console.log(err.message);
      res.status(400).json({"error":err.message});
      return;
    }
    result.forEach(function(v){ delete v.poster_url });
    res.send(result);
  });
});

router.get('/movies', (req, res) => {
  let data = req.query.genre;
  let data1 = req.query.rating;
  let sql,val;
  let placeholders='';
  if(data){
    sql = `SELECT * FROM movies WHERE GENRE1=? OR GENRE2=? OR GENRE3=?`;
    val=[data,data,data];
  }
  if(data1){
    if(data){
      placeholders='AND ( GENRE1=? OR GENRE2=? OR GENRE3=? )'
    }
    if(data1=='best'){
      if(data){
        val=['8',data,data,data];
      }else{
      val=['8']; }
      sql = `SELECT * FROM movies WHERE RATING > ? ${placeholders}`;
    }
    else if(data1=='average'){
      if(data){
        val = ['7.5','8',data,data,data];
      }else{
      val = ['7.5','8'];}
      sql = `SELECT * FROM movies WHERE RATING > ? AND RATING < ? ${placeholders}`;
    }
    else if(data1=='worst'){
      if(data){
        val = ['7.5',data,data,data];
      }else{
      val = ['7.5'];}
      sql = `SELECT * FROM movies WHERE RATING <= ? ${placeholders}`;
    }
  }
  con.query(sql,val,function (err, result) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    result.forEach(function(v){ delete v.poster_url });
    res.send(result);
  });
});

module.exports = router;