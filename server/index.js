const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

let cars = [];

// Load data from cars.json
function loadData() {
  try {
    const data = fs.readFileSync("./data/cars.json", "utf8");
    cars = JSON.parse(data);
  } catch (err) {
    console.error("Error reading data:", err);
  }
}

// Save data to cars.json
function saveData() {
  try {
    const data = JSON.stringify(cars, null, 2);
    fs.writeFileSync("./data/cars.json", data);
  } catch (err) {
    console.error("Error saving data:", err);
  }
}

// Load data when the server starts
loadData();

// Generate unique ID for cars
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// GET /
app.get("/", (req, res) => {
  res.json({ message: "ping successfully" });
});

// GET /cars
app.get("/cars", (req, res) => {
  res.json(cars);
});

// GET /cars/:id
app.get("/cars/:id", (req, res) => {
  const carId = req.params.id;
  const car = cars.find((car) => car.id === carId);
  if (!car) {
    res.status(404).json({ message: "Car not found" });
  } else {
    res.json(car);
  }
});

// POST /cars
app.post("/cars", (req, res) => {
  const newCar = req.body;
  newCar.id = generateId(); // Assign a unique ID
  cars.push(newCar);
  saveData(); // Save data to file
  res.status(201).json(newCar);
});

// PUT /cars/:id
app.put("/cars/:id", (req, res) => {
  const carId = req.params.id;
  const updatedCar = req.body;
  const index = cars.findIndex((car) => car.id === carId);
  if (index === -1) {
    res.status(404).json({ message: "Car not found" });
  } else {
    cars[index] = { ...cars[index], ...updatedCar };
    saveData(); // Save data to file
    res.json(cars[index]);
  }
});

// DELETE /cars/:id
app.delete("/cars/:id", (req, res) => {
  const carId = req.params.id;
  const index = cars.findIndex((car) => car.id === carId);
  if (index === -1) {
    res.status(404).json({ message: "Car not found" });
  } else {
    const deletedCar = cars.splice(index, 1);
    saveData(); // Save data to file
    res.json(deletedCar);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
