const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
//Host server
app.listen(PORT, () => {
    console.log(`Server is hosted on port : ${PORT}`);
});

mongoose.connect('mongodb+srv://Adarsh41:NotAdarsh41@cluster0.mehuvyh.mongodb.net/');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

app.use(bodyParser.json());

//schema for MongoDB
const callRecordSchema = new mongoose.Schema({
    callerNumber: String,
    receiverNumber: String,
    startTime: Date,
    endTime: Date,
    duration: Number
  });
  
  const CallRecord = mongoose.model('CallRecord', callRecordSchema);

  // Retrieve all call records
app.get('/call-records', async (req, res) => {
    try {
      const callRecords = await CallRecord.find({});
      res.json(callRecords);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get details of a specific call record by ID
  app.get('/call-records/:id', async (req, res) => {
    try {
      const callRecord = await CallRecord.findById(req.params.id);
      if (!callRecord) {
        return res.status(404).json({ message: 'Call record not found' });
      }
      res.json(callRecord);
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Create a new call record
  app.post('/call-records', async (req, res) => {
    try {
      const callRecord = new CallRecord(req.body);
      await callRecord.save();
      res.status(201).json(callRecord);
    } 
    catch (err) {
      res.status(400).json({ error: err});
    }
  });
  
  // Update call record details
  app.put('/call-records/:id', async (req, res) => {
    try {
      const callRecord = await CallRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!callRecord) {
        return res.status(404).json({ message: 'Call record not found' });
      }
      res.json(callRecord);
    }
     catch (err) {
      res.status(400).json({ error: err });
    }
  });
  
  //Delete a call record
  app.delete('/call-records/:id', async (req, res) => {
    try {
      const callRecord = await CallRecord.findByIdAndDelete(req.params.id);
      if (!callRecord) {
        return res.status(404).json({ message: 'Call record not found' });
      }
      res.json({ message: 'Call record deleted' });
    } 
    catch (err) {
      res.status(500).json({ error: err });
    }
  });
  
  //Undeclared routes routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  