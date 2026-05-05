/*const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('./models/User');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://punnaavanish:ATKTjeo0eIQO8CQO@translation.xgmab5x.mongodb.net/?retryWrites=true&w=majority&appName=translation').then(() => console.log('✅ Connected to MongoDB Altas'))
.catch((err) => console.error('❌ MongoDB Altas connection error:', err));

const translationSchema = new mongoose.Schema({
    sourceText: String,
    translatedText: String,
    method: String,
    userId: String, // 'text' or 'file'
    createdAt: { type: Date, default: Date.now }
});

const Translation = mongoose.model('Translation', translationSchema);

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });


// Route to handle text translation
app.post('/translate', async (req, res) => {
    const { text, use_pretrained, userId } = req.body;

    try {
        const response = await axios.post('http://127.0.0.1:8000/translate/', { text, use_pretrained });
        const translatedText = response.data.translated_text;

        // Save to MongoDB
        await Translation.create({
            sourceText: text,
            translatedText: translatedText,
            method: 'text',
            userId: userId
        });

        res.json({ original_text: text, translated_text: translatedText });

    } catch (error) {
        console.error('Translation failed:', error.message);
        res.status(500).json({ error: 'Failed to get translation' });
    }
});

// Route to handle PDF translation
app.post('/translate-pdf', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfText = await pdfParse(dataBuffer);
        // Split the text into sentences if needed, otherwise send the entire text
        const response = await axios.post('http://127.0.0.1:8000/translate/', {
            text: pdfText.text,
            use_pretrained: true
        });

        await Translation.create({
          sourceText: pdfText.text,
          translatedText: response.data.translated_text,
          method: 'file',
          userId: req.body.userId
        });

        res.json({
            original_text: pdfText.text,
            translated_text: response.data.translated_text
        });
    } catch (error) {
        console.error('PDF Translation failed:', error.message);
        res.status(500).json({ error: 'Failed to process PDF translation' });
    }
});

// Route to get translation history
/*app.get('/translations', async (req, res) => {
  /*const method = req.query.method;
  const query = method ? { method } : {};*/
  /*const { method, userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = { userId };  // 👈 Filter by user
  if (method) query.method = method;
  const all = await Translation.find(query).sort({ createdAt: -1 }).limit(10);
  res.json(all);
}); */

/*app.get('/translations', async (req, res) => {
  const { method, userId } = req.query;

  const query = { ...(method && { method }), ...(userId && { userId }) };
  
  const all = await Translation.find(query).sort({ createdAt: -1 }).limit(10);
  res.json(all);
});



// Route to clear translation history
app.delete('/translations', async (req, res) => {
  const method = req.query.method;
  const query = method ? { method } : {};
  await Translation.deleteMany(query);
  res.json({ message: 'History cleared' });
});

app.listen(port, () => console.log(`Node.js backend running on http://localhost:${port}`));
*/


const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('./models/User');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://punnaavanish:ATKTjeo0eIQO8CQO@translation.xgmab5x.mongodb.net/?retryWrites=true&w=majority&appName=translation')
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB Atlas connection error:', err));

const translationSchema = new mongoose.Schema({
    sourceText: String,
    translatedText: String,
    method: String,
    userId: String,
    createdAt: { type: Date, default: Date.now }
});

const Translation = mongoose.model('Translation', translationSchema);

const app = express();
const port = process.env.PORT || 5000;  // Important for Render

// Replace this URL with your **actual frontend URL deployed on Render**
//const FRONTEND_URL = 'https://my-frontend-x21h.onrender.com';  // <--- Set your frontend URL here
const FRONTEND_URL = 'https://language-translation-2-izus.onrender.com';
// Allow CORS only from your deployed frontend
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

// Replace this with your actual ngrok FastAPI backend URL
//const FASTAPI_URL = 'https://68d2-34-21-48-84.ngrok-free.app/translate/';  // <--- Set your FastAPI URL here
  const FASTAPI_URL = 'https://Bhargava093-Bhargava.hf.space/translate/';
// Route to handle text translation
app.post('/translate', async (req, res) => {
    const { text, use_pretrained, userId } = req.body;

    try {
        const response = await axios.post(FASTAPI_URL, { text, use_pretrained });
        const translatedText = response.data.translated_text;

        await Translation.create({
            sourceText: text,
            translatedText: translatedText,
            method: 'text',
            userId: userId
        });

        res.json({ original_text: text, translated_text: translatedText });

    } catch (error) {
        console.error('Translation failed:', error.message);
        res.status(500).json({ error: 'Failed to get translation' });
    }
});

// Route to handle PDF translation
app.post('/translate-pdf', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfText = await pdfParse(dataBuffer);

        const response = await axios.post(FASTAPI_URL, {
            text: pdfText.text,
            use_pretrained: true
        });

        await Translation.create({
            sourceText: pdfText.text,
            translatedText: response.data.translated_text,
            method: 'file',
            userId: req.body.userId
        });

        res.json({
            original_text: pdfText.text,
            translated_text: response.data.translated_text
        });

    } catch (error) {
        console.error('PDF Translation failed:', error.message);
        res.status(500).json({ error: 'Failed to process PDF translation' });
    }
});

// Route to get translation history (filter by method and userId)
app.get('/translations', async (req, res) => {
    const { method, userId } = req.query;
    const query = { ...(method && { method }), ...(userId && { userId }) };
    const all = await Translation.find(query).sort({ createdAt: -1 }).limit(10);
    res.json(all);
});

// Route to clear translation history
app.delete('/translations', async (req, res) => {
    const method = req.query.method;
    const query = method ? { method } : {};
    await Translation.deleteMany(query);
    res.json({ message: 'History cleared' });
});

// Start server
app.listen(port, () => console.log(`🚀 Node.js backend running on port ${port}`));
