const filePath= "./movieData.csv";
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
var con = require('./server/db');

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    //console.log(results[0].Title);
    let records = [];
    for(let i=0;i<results.length;i++){
      records.push(Object.values(results[i]));
    }

      // insert statment
      let sql = `INSERT INTO movies(TITLE,RATING,TOTAL_VOTES,GENRE1,GENRE2,GENRE3,META_CRITIC,BUDGET,RUNTIME)
                VALUES ?`;
      //execute the insert statment
      con.query(sql, [records], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // get inserted rows
        console.log('Row inserted:' + results.affectedRows);
      });
  });