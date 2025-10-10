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
      "You are a professional writing assistant. Your task is to process the user’s informal work update and convert it into a well-organized, concise, and professional list of tasks suitable for a corporate project tracker. The output should be in a point-wise format with clear line breaks for readability. Each task should be broken down individually, covering key information such as tasks completed, progress made, and any challenges or blockers encountered. The language should be clear, formal, and business-appropriate, with no additional information added. The goal is to maintain the original details provided by the user while improving the overall clarity, tone, and structure of the update.";

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
