const express = require("express");
const port = 3000;
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/public', express.static(__dirname + "/public"));
app.get('/', (req, res) => res.sendFile(__dirname + "/public/index.html"));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const io = require("socket.io")(server);

var lastLetter = ""; //stores the last generated letter
var selectedLists = ["hiragana", "katakana"/*, "kanji"*/];

function send()
{
  var alphabet = JSON.parse(fs.readFileSync("./public/alphabet.json"));
  var list = Object.keys(alphabet);
  var letters = Object.entries(alphabet[selectedLists[Math.floor(Math.random() * selectedLists.length)]]); //Selects a random list from selectedLists

  var letterGenerated = letters[Math.floor(Math.random() * letters.length)];

  if(letterGenerated[0] === lastLetter[0]) //Handles repeated letters and generates a new one
  {
    return send();
  }

  lastLetter = letterGenerated;

  io.emit("show", letterGenerated);
}


io.on('connection', function (socket) {
  io.emit("checkboxes", selectedLists);
  send();

  socket.on('request', function() {
    send();
  });

  socket.on("selectList", function(list) { //Selects or unselects the pretented list and send a new letter
    if(selectedLists.find(element => element == list))
    {
      selectedLists.splice(selectedLists.indexOf(list), 1);
    }
    else
    {
      selectedLists.push(list);
    }

    send();
  });

  socket.on('disconnect', function () {
    //console.log('user disconnected');
  });
});
