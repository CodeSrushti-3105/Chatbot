const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env file");
    process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST endpoint for chat
app.post('/chat', async (req, res) => {
    try {
        const userQuestion = req.body.question;

        if (!userQuestion) {
            return res.status(400).json({ error: "Question is required" });
        }

        console.log(`📩 Received question: ${userQuestion}`);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const customContext = "Reply in a friendly, conversational tone. You are chatbot for Student manager application. give response in points wise and in short and understandable form. Keep answers concise and direct. try to provide arrow flow diagram if possible for given question . Not give such large number of words in output.";
        const prompt = `${customContext}\n\nUser question: ${userQuestion}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`📤 Reply: ${text}`);

        res.json({ reply: text });
    } catch (error) {
        console.error('🔥 Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running at https://chatbot-1-hgjd.onrender.com`);
});
