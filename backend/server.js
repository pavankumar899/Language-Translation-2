const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // Ensure that you have this installed
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/translatorDB').then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

  const translationSchema = new mongoose.Schema({
    sourceText: String,
    translatedText: String,
    method: String, // 'text' or 'file'
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
    const { text, use_pretrained } = req.body;

    try {
        const response = await axios.post('http://127.0.0.1:8000/translate/', { text, use_pretrained });
        //res.json({ original_text: text, translated_text: response.data.translated_text });
        const translatedText = response.data.translated_text;

        // Save to MongoDB
        await Translation.create({
        sourceText: text,
        translatedText: translatedText,
        method: 'text'
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
          method: 'file'
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

app.listen(port, () => console.log(`Node.js backend running on http://localhost:${port}`));

app.get('/translations', async (req, res) => {
  const all = await Translation.find().sort({ createdAt: -1 }).limit(10);
  res.json(all);
});