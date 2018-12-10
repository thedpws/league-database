const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("flowers-2.db");

exports.serveHTML = (req, res) => {
  fs.readFile('./client/index.html', 'utf8', (err, data) => {
    if (err) res.status(500).send();
    else res.status(200).send(data);
  });
}

//TODO test
exports.serveJS = (req, res) => {
  fs.readFile('./client/index.js', 'utf8', (err, data) => {
    if (err) res.status(500).send();
    else res.status(200).send(data);
  });
}

//working
exports.listFlowers = (req, res) => {
  db.all("select * from flowers", [], (err, rows) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(rows);
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
//POST to /sighting
//parameters name, person, location, date ("YYYY-MM-DD")
//working
exports.addSighting = (req, res) => {
  const params = [req.query["name"], req.query["person"], req.query["location"], req.query["sighted"]];
  //console.log(req);
  params.forEach(param => {
    //console.log(param);
    if (!param) {
      res.status(400).send();
      return;
    }
  });
  db.run("insert into sightings (name, person, location, sighted) values (?,?,?,?)", params, err => {
    if (err) res.status(500).send();
    else res.status(200).send();
  });
}
