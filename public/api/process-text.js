// api/process-text.js
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize the Google GenAI client with your API key from environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the POST endpoint
app.post("/process-text", async (req, res) => {
  try {
    const { userText } = req.body;

    // Check if userText is provided
    if (!userText) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Define a professional system prompt
    const systemPrompt =
      "You are a professional writing assistant. Convert the user's informal work update into a professional, concise, and well-structured paragraph suitable for a corporate project tracker. Preserve all key information about tasks completed, progress, and challenges, but improve the language, clarity, and business tone. Do not add any information not present in the original text.";

    // Send the request to the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use the Gemini 2.0 Flash model for speed
      contents: systemPrompt + "\n\nUser's update: " + userText,
    });

    // Extract the processed text from the response
    const processedText = response.text;

    // Send the successful response back to the frontend
    res.json({
      success: true,
      processedText: processedText,
    });
  } catch (error) {
    console.error("Error processing text with Gemini API:", error);
    // Send a generic error message to the client
    res.status(500).json({
      success: false,
      error: "Failed to process text with AI",
    });
  }
});

// Export the app as a serverless function (compatible with Vercel)
export default app;
