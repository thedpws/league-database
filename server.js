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

//lookup flower
//pathparam flower common name
//access by req.params.comname
app.get('/flower/:comname', controller.getFlowerDetails);

app.get('/flower/search/:keyword', controller.searchFlower)

//return all flowers
app.get('/flower', controller.listFlowers);

//PUT
// sample: localhost:8083/flower/Douglas dustymaiden?genus=douglas is gay lmao&species=gagagag
app.put('/flower/:comname', controller.updateFlower);

//POST
app.post('/flower', controller.createFlower);

//DELETe
app.delete('/flower/:comname', controller.deleteFlower);

//app.post('/user/:username', controller.registerUser)

//add sighting
//query params
//sample: http://localhost:8083/sighting/?name=someflowernamefff&person=me&location=up ur butt around the corner&sighted=2018-09-20
app.post('/sighting', controller.addSighting);
app.get('/sighting/:comname', controller.getSightings);

app.post('/user', controller.registerUser);
app.get('/user', controller.authenticateUser);
//starting the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
});
