const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())       // remove the error cannot destructure property name of req.body cause its undefined

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/wine-storage', {
      useNewUrlParser: true,
      bufferCommands: false,                        // increase buffer time
      useUnifiedTopology: true});
      console.log("MongoDB connected!");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error)
  }
}


// Define wine schema
const wineSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  year: {
    type: Number,
    validate: {
      validator: function(v) {
        return /\d{4}/.test(v);     // ensures that the year exactly contains 4 digits
      },
      message: props => `${props.value} is not a valid year!`
    },
    required: [true, 'Year is required']
  },
  country: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['red', 'white', 'rose'],
    default: 'red'                  // assumption that red is the best and should be the default type
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    validate: {
      validator: function(v) {
        return v >= 0;              // checks that the price is existing in euro --> greater than 0
      },
      message: props => `${props.value} is not a valid price in Euro!`    
    },
    required: [false, 'Price is not required']
  },
});


// Create wine model
const Wine = mongoose.model('Wine', wineSchema);

// Add a new wine to the database, get data from the request to the server and send it in the response to the client
app.post('/addWine', async (req, res) => {
  const { name, year, country, type, description, price } = req.body;
  const newWine = new Wine({ name, year, country, type, description, price });
  await newWine.save();
  res.send('Wine added to the database!');
});


// Get all wines from the database and send them to the client in the response
app.get('/getWines', async (req, res) => {
  const wines = await Wine.find();
  res.send(wines);
});

/* alternative function, providing the same functionality as the above one but the previous one is more readable cause of the usages of await and async
app.get('/wines', (req, res) => {
  Wine.find({}, (err, wines) => {
    if (err) {
      res.send(err);
    } else {
      res.json(wines);
    }
  });
});
*/

// Get a specific wine from the database and send this one to the client in the response, pass name as url param
app.put('/updateWine/:name', async (req, res) => {
  try {
    const wine = await Wine.findOneAndUpdate({ name: req.params.name }, req.body, { new: true });
    res.json(wine);
  } catch (err) {
    res.send(err);
  }
});

// Remove a wine from the database and send status of operation back to the client in the response, pass name as url param        
app.delete('/removeWine/:name', async (req, res) => {
  try {
    await Wine.deleteOne({ name: req.params.name });
    res.json({ message: 'Wine deleted' });
  } catch (err) {
    res.send(err);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// usage of mongoDB and Express.js framework
// You will need to install express, mongoose, and mongodb dependency


// call the methods
/*app.ajax({
  url: 'http://localhost:3000/addWine',
  type: 'POST',
  data: JSON.stringify({ name: 'leBlanc', price: 33, type: 'red', country: 'germany', year: 2002 }),
  contentType: 'application/json',
  success: function(data) {
    console.log('Wine created successfully');
  },
  error: function(error) {
    console.log('Error: ' + error);
  }
});

app.ajax({
  url: 'http://localhost:3000/getWines',
  type: 'GET',
  success: function(data) {
    console.log(data);
  },
  error: function(error) {
    console.log('Error: ' + error);
  }
});

app.ajax({
  url: 'http://localhost:3000/updateWine/leBlanc',
  type: 'PUT',
  data: JSON.stringify({ price: 20, type: 'rose' }),
  contentType: 'application/json',
  success: function(data) {
    console.log('Wine updated successfully');
  },
  error: function(error) {
    console.log('Error: ' + error);
  }
});

app.ajax({
  url: 'http://localhost:3000/deleteWine/leBlanc',
  type: 'DELETE',
  success: function(data) {
    console.log('Wine deleted successfully');
  },
  error: function(error) {
    console.log('Error: ' + error);
  }
});*/

// test the endpoints
fetch('http://localhost:3000/addWine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'leBlanc',
        year: '2022',
        country: 'germany',
        type: 'red',
        description: 'dry but not too dry',
        price: 25
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

fetch('http://localhost:3000/getWines', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
  })
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

fetch(`http://localhost:3000/updateWine/leBlanc`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'leBlanc',
        year: '2023',
        country: 'France',
        type: 'white',
        description: 'Dry and crisp with flavors of citrus and green apple.',
        price: 35
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

fetch(`http://localhost:3000/removeWine/leBlanc`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' }
  })
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

