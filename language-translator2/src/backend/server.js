const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // Ensure that you have this installed

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
        res.json({ original_text: text, translated_text: response.data.translated_text });
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


