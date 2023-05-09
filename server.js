const express = require('express');
const path = require('path');
const app = express();
const noteData = require('./db/db.json');
const uuid = require('./public/assets/js/uuid.js');
const fs = require('fs');
const PORT = process.env.PORT || 3001


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);



app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

app.get('/api/notes', (req, res) => {
    res.json(noteData);

});

app.post('/api/notes', (req, res) => {

    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid()
    };

    noteData.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(noteData), (err) => {
        if (err) {
            console.error(err);
        } else {
            res.json(noteData);
    }
    });
    });

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const index = noteData.findIndex((note) => note.id === id);
    if (index !== -1) {
        noteData.splice(index, 1);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err) => {
            if (err) {
                console.error(err);
            } else {
                res.json(noteData);
            }
        });
    } else {
        res.status(404).send('Note not found');
    }
});



    
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
    );
