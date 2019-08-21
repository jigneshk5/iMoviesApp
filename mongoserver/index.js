const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI,{
  useNewUrlParser: true 
}).then( ()=>{
    console.log('Connected to Database!');
})
.catch(err =>{
  console.log(err);
})
//Middleware

app.use(bodyParser.json());
app.use(cors());

//Handle production
if(process.env.NODE_ENV === 'production' ){
  app.use(express.static(__dirname+'/public/'));
  //Handle SPA
  app.get(/.*/,(req,res) => {
    res.sendFile(__dirname+'/public/index.html');
  });
}
app.use(express.static(path.join(__dirname, 'public')));

const movie = require('./routes/movies');

app.use('/api',movie);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Default response for any other request
app.use(function(req, res){
    res.status(404).send({"msg":"404 NOT FOUND"});
});

const port = process.env.PORT || 2000;

app.listen(port,function(){
  console.log(`server started at port ${port}`);
});
