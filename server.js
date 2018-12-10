const http = require('http'),
  url = require('url'),
  port = 8083;


const express = require('express');
const app = express();


const controller = require('./controller.js');

//get static indexhtml
app.get('/', controller.serveHTML);

//get static js
app.get('/script', controller.serveJS);

//return all flowers
//app.get('/flower', controller.getAllFlowers);

//lookup flower
//pathparam flower common name
//access by req.params.comname
app.get('/flower/:comname', controller.lookupFlower);



//add sighting
//query params
app.post('/sighting', controller.addSighting);



//starting the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
});
