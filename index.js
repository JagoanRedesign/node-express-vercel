const http = require('http');
const express = require("express");
const home = require("./routes/home");

const app = express();
app.use(express.json());

let coming = {};
let visitor = 0;

function removeTime(data) {
  setTimeout(() => {
    if (coming[data] !== undefined) {
      delete coming[data];
    }
  }, 120000);
}

app.post('/push', (req, res) => {
  visitor++;
  let db = {
    ip: "",
    data: "",
    hash: "",
    textButton: ""
  };

  try {
    const come = req.body;
    db.ip = come.ip || db.ip;
    db.data = come.data || db.data;
    db.hash = come.hash || db.hash;
    db.textButton = come.textButton || db.textButton;
  } catch (e) {
    // Handle error
  }

  coming[db.ip] = {
    data: db.data,
    hash: db.hash,
    textButton: db.textButton
  };

  res.json({ status: "ok" });
  removeTime(db.ip);
});

app.post('/get', (req, res) => {
  let dbOut = {
    data: "",
    hash: "",
    textButton: ""
  };

  try {
    const dbGet = req.body;
    if (coming[dbGet.ip] !== undefined) {
      dbOut = coming[dbGet.ip];
      delete coming[dbGet.ip];
    }
  } catch (e) {
    // Handle error
  }

  res.json(dbOut);
});

app.get('/status', (req, res) => {
  res.json(coming);
});

app.get('/visitor', (req, res) => {
  res.send(visitor.toString());
});

app.use("/home", home);

const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
