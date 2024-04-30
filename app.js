const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'style')));
app.use(bodyParser.json());

const DATA_FILE = 'saved/events.json';

if (!fs.existsSync(DATA_FILE)){
    console.log('Created file')
    fs.writeFileSync(DATA_FILE, '[]');
}else{
    console.log('The file exists')
}

let calendarEvents = loadEvents();

function loadEvents() {
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    }catch (error) {
        console.log('file does not exist or cannot be read')
        return [];
    }
}

function saveEvents() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(calendarEvents, null, 2))
}

app.get('/index/api/calendar', (req, res) => {
    res.sendFile(__dirname + '/templates/index.html');
});

app.get('/api/events', (req, res) => {
    res.json(calendarEvents);
})

app.post('/api/events', (req, res) => {
    const newEvent = req.body;

    newEvent.id = calendarEvents.length + 1;
    calendarEvents.push(newEvent);
    saveEvents();
    res.status(201).json(newEvent);
})

app.put('/api/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id);
    const updateEvent = req.body;
    const index = calendarEvents.findIndex(event => event.id === eventId);
    if(index !== -1){
        //calendarEvents[index] = updateEvent;
        calendarEvents[index] = { ...calendarEvents[index], ...updatedEvent };
        saveEvents();
        res.json(calendarEvents[index]);
    }else{
        res.status(404).json({ message : 'Event not found' })
    }
});

app.delete('/api/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id);
    const index = calendarEvents.findIndex(event => event.id === eventId);
    if (index !== -1) {
        calendarEvents.splice(index, 1);
        saveEvents();
        res.status(204).send();
    }else{
        res.status(404).json({ message: 'Event not found' });
    }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}) 
