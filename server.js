const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Contact model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});
const Contact = mongoose.model('contact', contactSchema);

// Set up the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'flirtycoding@gmail.com',
    pass: 'vrfn fgwa dlez psmh',
  },
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Save the contact form submission to MongoDB
  const contact = new Contact({ name, email, message });
  await contact.save();

  // Send the email using nodemailer
  await transporter.sendMail({
    from: 'flirtycoding@gmail.com',
    to: 'journeykonnects.abhi@gmail.com',
    subject: 'New contact form submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});