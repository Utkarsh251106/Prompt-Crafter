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

// Hardcoded login (same as before)
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

// ---------------------------------------------------------
//     UPDATED AI GENERATION ROUTE (Option A + Format 1)
// ---------------------------------------------------------
app.post("/generate", async (req, res) => {
  const f = req.body;

  // Build structured prompt
  const prompt = `
Generate a structured marketing image prompt based on the following details:

===============================
 BUSINESS INFORMATION
===============================
Business Name: ${f.name}
Category: ${f.category}
Sub-Category / Service Type: ${f.subCategory}
Target Audience Persona: ${f.persona}
Image Type: ${f.imageType}

===============================
 BEFORE (Current State)
===============================
Persona (Before): ${f.beforePersona}
Main Problem: ${f.beforeProblem}
Emotional State: ${f.beforeEmotion}
Environment / Situation: ${f.beforeEnvironment}
Text on Image (Before): ${f.beforeText}

===============================
 AFTER (Transformed State)
===============================
Persona (After): ${f.afterPersona}
Support Used: ${f.afterSupport}
Results / Outcomes: ${f.afterResult}
Emotional State: ${f.afterEmotion}
Text on Image (After): ${f.afterText}

===============================
  OUTPUT REQUIREMENTS
===============================
- Provide a clean, structured marketing prompt.
- Describe the Before state → Transition → After state.
- Do NOT write a story.
- Keep it professional, short, and ready for Midjourney / DALL·E.
- Include all key details.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You generate structured AI image prompts for marketing."
        },
        {
          role: "user",
          content: prompt
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
