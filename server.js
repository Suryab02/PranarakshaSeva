const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const Blood = require('./models/Blood');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Ambulance = require('./models/Ambulance');

dotenv.config({ path: './config/config.env' });

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => res.send('hello user'));


// ------------------------ BLOOD ------------------------

// Get blood data by city and blood group
app.get('/blood', async (req, res) => {
  try {
    const { city, blood } = req.query;
    let query = { city };
    if (blood) query.name = blood;

    const bloodData = await Blood.find(query);
    res.status(200).json(bloodData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blood data' });
  }
});

// Post method (same logic as /blood)
app.post('/getblood', async (req, res) => {
  try {
    const { city } = req.query;
    const { blood } = req.body;
    let query = { city };
    if (blood) query.name = blood;

    const bloodData = await Blood.find(query);
    res.status(200).json(bloodData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blood data' });
  }
});

// Get blood stock for a bank
app.get('/bloodcount', async (req, res) => {
  try {
    const { bank } = req.query;
    const data = await Blood.find({ bankname: bank });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blood count' });
  }
});

// Update blood quantity
app.post('/bloodcount', async (req, res) => {
  try {
    const { bank } = req.query;
    const { name, count } = req.body;
    const updated = await Blood.findOneAndUpdate(
      { bankname: bank, name },
      { quantity: count },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating blood count' });
  }
});

// Delete blood type from a bank
app.post('/delete', async (req, res) => {
  try {
    const { name } = req.body;
    const { bank } = req.query;
    await Blood.findOneAndRemove({ bankname: bank, name });
    res.status(200).json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  }
});

// Add new blood entry
app.post('/blood', async (req, res) => {
  try {
    const { name, quantity, bankname, city } = req.body;
    const blood = new Blood({ name, quantity, bankname, city });
    const saved = await blood.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving blood data' });
  }
});


// ------------------------ DOCTOR ------------------------

app.get('/doctor', async (req, res) => {
  try {
    const { city } = req.query;
    const doctors = await Doctor.find({ city });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching doctor data' });
  }
});

app.post('/doctor', async (req, res) => {
  try {
    const { name, qualification, contact, hospital, city } = req.body;
    const doctor = new Doctor({ name, qualification, contact, hospital, city });
    const saved = await doctor.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving doctor data' });
  }
});


// ------------------------ AMBULANCE ------------------------

app.get('/ambulance', async (req, res) => {
  try {
    const { city } = req.query;
    const ambulances = await Ambulance.find({ city });
    res.status(200).json(ambulances);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching ambulance data' });
  }
});

app.post('/ambulance', async (req, res) => {
  try {
    const { contact, hospital, city } = req.body;
    const ambulance = new Ambulance({ contact, hospital, city });
    const saved = await ambulance.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving ambulance data' });
  }
});


// ------------------------ USER ------------------------

app.post('/user', async (req, res) => {
  try {
    const { username, password, bankname } = req.body;
    const user = new User({ username, password, bankname });
    const saved = await user.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving user' });
  }
});

app.post('/validate', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await User.find({ username, password });
    if (users.length > 0) {
      res.status(200).send(users[0].bankname);
    } else {
      res.status(200).send(false);
    }
  } catch (err) {
    console.error(err);
    res.status(200).send(false);
  }
});


// ------------------------ SERVER ------------------------

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please free it or choose another one.`);
    process.exit(1);
  } else {
    throw err;
  }
});
