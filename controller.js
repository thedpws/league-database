const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("flowers-2.db");

exports.serveHTML = (req, res) => {
  fs.readFile('./client/index.html', 'utf8', function(err, data) {
    if (err) res.status(500).send();
    else res.status(200).send(data);
  });
}

//TODO test
exports.serveJS = (req, res) => {
  fs.readFile('./client/index.js', 'utf8', function(err, data) {
    if (err) res.status(500).send();
    else res.status(200).send(data);
  });
}

//working
exports.lookupFlower = (req, res) => {
  const comname = req.params["comname"];
  //console.log(`Looking up flower: ${comname}`);
  db.get("select * from flowers where comname = ?",[comname] , (err,row) => {
    //console.log(`rs: ${row}`);
    if (err) res.status(500).send(err);
    else if (!row) res.status(204).send(err);
    else res.status(200).send(row);
  });
}

//todo: test
exports.addSighting = (req, res) => {
  res.status(501).send();
}
