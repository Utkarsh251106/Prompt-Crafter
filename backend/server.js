require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI Setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Hardcoded login
const USER = {
  username: "admin",
  password: "admin123"
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Invalid credentials" });
});

// ---- AI GENERATION ROUTE ----
app.post("/generate", async (req, res) => {
  const { name, category, subCategory, persona, imageType } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",   // or gpt-4.1, gpt-4o
      messages: [
        {
          role: "system",
          content: "You are an AI that generates marketing prompts based on business details."
        },
        {
          role: "user",
          content: `
Create a detailed AI image/prompt for this business:

Business Name: ${name}
Category: ${category}
Sub-Category: ${subCategory}
Target Audience Persona: ${persona}
Image Type: ${imageType}

The output should be structured, clear and perfect for image generation tools like Midjourney or DALL·E.
          `
        }
      ]
    });

    res.json({
      success: true,
      output: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate content" });
  }
});

// Start Server
app.listen(5000, () => {
  console.log("Backend server running on port 5000");
});
