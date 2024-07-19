const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, "data.json");

// Helper function to read data from the JSON file
const readData = () => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Get all tickets
app.get("/tickets", (req, res) => {
  const tickets = readData();
  res.json(tickets);
});

// Get a single ticket by ID
app.get("/tickets/:id", (req, res) => {
  const tickets = readData();
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id, 10));
  if (!ticket) {
    return res.status(404).send("Ticket not found.");
  }
  res.json(ticket);
});

// Create a new ticket
app.post("/tickets", (req, res) => {
  const tickets = readData();
  const newTicket = {
    id: tickets.length ? tickets[tickets.length - 1].id + 1 : 1, // Auto-increment ID
    ...req.body,
  };
  tickets.push(newTicket);
  writeData(tickets);
  res.status(201).json(newTicket);
});

// Update a ticket by ID
app.put("/tickets/:id", (req, res) => {
  const tickets = readData();
  const index = tickets.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).send("Ticket not found.");
  }
  const updatedTicket = { ...tickets[index], ...req.body };
  tickets[index] = updatedTicket;
  writeData(tickets);
  res.json(updatedTicket);
});

// Delete a ticket by ID
app.delete("/tickets/:id", (req, res) => {
  const tickets = readData();
  const index = tickets.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).send("Ticket not found.");
  }
  tickets.splice(index, 1);
  writeData(tickets);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
