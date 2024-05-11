const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const app = express();
const bodyParser=require( "body-parser" )
const uri ="mongodb+srv://chibhiraj:Chibhiraj@mydb.uzc7ogf.mongodb.net/setit";
const port=3001;

app.use(cors());
app.use(express.json());

mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const dbConn = mongoose.connection;

dbConn.on("error" , console.error.bind(console, "Connection Error"));
dbConn.on("open", function(){
  console.log("DB Connection succesful");
})

const EventSchema= new mongoose.Schema({
    eventName: String,
    eventLink: String
});

const event=mongoose.model('events',EventSchema);


app.post('/', async (req, res) => {
  try {
    const { eventName,eventLink } = req.body;
    const newEvent = new event({ eventName,eventLink });
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', async (req, res) => {
  try {
    const events = await event.find({});
    // console.log(users);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/:userId', async (req, res) => {
  try {
    const eventId = req.params.userId;
    const {event} = req.body;
    const updatedEvent = await event.findByIdAndUpdate(eventId, {eventName,eventLink }, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete('/:userId', async (req, res) => {
  try {
    const eventId = req.params.userId; 
    const deletedEvent = await event.findByIdAndDelete(userId);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(port , () => console.log(`Example app listening on port !`));
