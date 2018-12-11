const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("flowers-2.db");
const userdb = new sqlite3.Database("users.db");

//initialize usersdb
userdb.run("create table if not exists USERS (USERNAME varchar(30), constraint uniqueUname primary key (USERNAME))");

//working
exports.listFlowers = (req, res) => {
  db.all("select * from flowers", [], (err, rows) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(rows);
  });
}

//working
exports.getFlowerDetails = (req, res) => {
  const comname = req.params["comname"];
  if (!comname) return res.status(400).send();
  //console.log(`Looking up flower: ${comname}`);
  db.get("select * from flowers where comname = ?",[comname] , (err,row) => {
    //console.log(`rs: ${row}`);
    if (err) res.status(500).send(err);
    else if (!row) res.status(204).send(err);
    else res.status(200).send(row);
  });
}
//working
exports.searchFlower = (req, res) => {
  const keyword = req.params["keyword"].toLowerCase();
  if (!keyword) return res.status(400).send();

  db.all("select * from flowers", [], (err, rows) => {
    if (err) return res.status(500).send();
    const matches = rows.filter(row => {
      //console.log(row);
      if (row.COMNAME.toLowerCase().includes(keyword) || keyword.includes(row.COMNAME.toLowerCase())) return true;
      if (row.GENUS.toLowerCase().includes(keyword) || keyword.includes(row.GENUS.toLowerCase())) return true;
      if (row.SPECIES.toLowerCase().includes(keyword) || keyword.includes(row.SPECIES.toLowerCase())) return true;
      return false;
    });
    if (!matches) return res.status(204).send();
    else return res.status(200).send(matches);
  });
}

//working
exports.updateFlower = (req, res) => {
  const comname = req.params["comname"];
  const genus = req.query.genus;
  const species = req.query.species;
  if (!comname || !genus || !species) return res.status(400).send();
  const params = [genus, species, comname];
  db.run("update flowers set genus=?, species=? where comname=?", params, err => {
    if (err) return res.status(500).send(err);
    else return res.status(200).send();
  });
}

//working
exports.createFlower = (req, res) => {
  const comname = req.query.comname;
  const genus = req.query.genus;
  const species = req.query.species;
  if (!comname || !genus || !species) return res.status(400).send();
  const params = [comname, genus, species];

  db.run("insert into flowers (comname, genus, species) values (?,?,?)", params, err => {
    if (err) return res.status(500).send();
    else return res.status(201).send();
  });
}
//working
exports.deleteFlower = (req, res) => {
  const comname = req.params["comname"];
  if (!comname) return res.status(400).send();
  db.run("delete from flowers where comname=?", [comname], err => {
    if (err) return res.status(500).send();
    else res.status(200).send();
  });
}

//todo: test
//POST to /sighting
//parameters name, person, location, date ("YYYY-MM-DD")
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
    else res.status(201).send();
  });
}


//working
exports.getSightings = (req, res) => {
  const comname = req.params["comname"];
  if (!comname) return res.status(400).send();
  db.all("select * from sightings where name=? order by sighted desc limit 10", [comname], (err, rows) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(rows);
  });
}
//working
exports.registerUser = (req, res) => {
  const username = req.query["username"];
  if (!username) return res.status(400).send();
  userdb.run("insert into users (username) values (?)", [username], err => {
    if (err) return res.status(500).send(err);
    else return res.status(201).send(err);
  });
}
//working
exports.authenticateUser = (req, res) => {
  const username = req.query["username"];
  userdb.get("select * from users where username = ?", [username], (err, row) => {
    if (err) return res.status(500).send(err);
    else if (!row) res.status(204).send();
    else res.status(200).send();
  })
}
