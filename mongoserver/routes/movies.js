const express = require('express');
const Movie = require("../models/movie");
const router = express.Router();


/* Returns all movies from database  */

router.get('/', (req, res) => {
  Movie.find({}, {_id:0}).exec(function(err, movies) {
      if (err) throw err;
      res.send(movies);
  });
});


router.get('/filter', (req, res) => {
  var ask,data,data1;
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
if(data1==null){
  console.log(ask+','+data);
  Movie.find({}, {_id:0})
  .where(ask).equals(data)
  .exec(function(err, movies) {
      if (err) throw err;
      res.send(movies);
  });
}
else{
  Movie.find({
    $or:[{GENRE1:data1},{GENRE2:data1},{GENRE3:data1}]
  },
  {_id:0})
  .where(ask).equals(data)
  .exec(function(err, movies) {
      if (err) throw err;
      res.send(movies);
  });
}
});

router.get('/movies', (req, res) => {
  let data = req.query.genre;
  let data1 = req.query.rating;
  if(data && data1){
    if(data1=='best'){
      Movie.find({
        $or:[{GENRE1:data},{GENRE2:data},{GENRE3:data}]
      },{_id:0})                                  //_id must be specifically excluded
      .where('RATING').gt(8)
      .exec(function(err, movies) {
          if (err) throw err;
          console.log("Best rated");
          res.send(movies);
      });
    }
    else if(data1=='average'){
      Movie.find({
        $or:[{GENRE1:data},{GENRE2:data},{GENRE3:data}]
      },
      {_id:0})
      .where('RATING').gt(7.5).lt(8)
      .exec(function(err, movies) {
          if (err) throw err;
          res.send(movies);
      });
    }
    else if(data1=='worst'){
      Movie.find({
        $or:[{GENRE1:data},{GENRE2:data},{GENRE3:data}]
      },
      {_id:0})
      .where('RATING').lt(7.5)
      .exec(function(err, movies) {
          if (err) throw err;
          res.send(movies);
      });
    }
  }
  if(data){
    Movie.find({
      $or:[{GENRE1:data},{GENRE2:data},{GENRE3:data}]
    },
    {_id:0})
    .exec(function(err, movies) {
        if (err) throw err;
        res.send(movies);
    });
  }
  if(data1){
    if(data1=='best'){
      Movie.find({}, {_id:0})
      .where('RATING').gt(8)
      .exec(function(err, movies) {
          if (err) throw err;
          res.send(movies);
      });
    }
    else if(data1=='average'){
      Movie.find({}, {_id:0})
      .where('RATING').gt(7.5).lt(8)
      .exec(function(err, movies) {
          if (err) throw err;
          res.send(movies);
      });
    }
    else if(data1=='worst'){
      Movie.find({}, {_id:0})
      .where('RATING').lt(7.5)
      .exec(function(err, movies) {
          if (err) throw err;
          res.send(movies);
      });
    }
  }

});

module.exports = router;