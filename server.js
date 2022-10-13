const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');

const PORT = 3001;

const app = express();

function update(data){//updates the "db"
  fs.writeFile('./db/db.json',JSON.stringify(data),(error)=>{
    if(error){
      console.log(error);
    }
  });
}

function remove(id){//removes a task and updates the db
  let temp = noteData['tasks'].filter(task => task.id!=id);
  noteData['tasks']=temp;
  update(noteData);
}

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(noteData['tasks']));

app.post('/api/notes', (req,res) =>{
    req.body['id']=noteData['idCounter']+1;
    noteData['idCounter']+=1;
    noteData['tasks'].push(req.body);
    res.json(req.body);
    update(noteData);
});

app.delete('/api/notes/:id',(req,res) =>{
  remove(req.params.id);
  res.sendFile(path.join(__dirname, '/public/notes.html'));
  

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
