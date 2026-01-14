require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// =============================
//  MIDDLEWARE (IMPORTANT)
// =============================

// Allow frontend (5173) to talk to backend (5000)
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

// Parse JSON body
app.use(bodyParser.json());


// =============================
//  HARDCODED LOGIN
// =============================

const USER = {
  username: "admin",
  password: "admin123"
};

app.post("/login", (req, res) => {
  console.log("LOGIN REQUEST RECEIVED:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }

  if (username === USER.username && password === USER.password) {
    return res.json({ success: true });
  }

  return res.json({ success: false, message: "Invalid credentials" });
});


// =============================
//  RULE-BASED PROMPT GENERATION
// =============================

// Emotion opposites for rule engine
const emotionMapping = {
  "stressed": "relieved",
  "confused": "confident",
  "worried": "assured",
  "frustrated": "empowered",
  "tired": "energized",
  "sad": "hopeful",
  "anxious": "calm",
  "overwhelmed": "in control"
};

// Reverse emotion
function getOppositeEmotion(before) {
  if (!before) return "positive and confident";

  const key = before.trim().toLowerCase();
  return emotionMapping[key] || "positive and confident";
}

// Auto-generate AFTER section
function generateAfter(beforePersona, beforeEmotion, beforeProblem) {
  return {
    afterPersona: `${beforePersona} transformed`,
    afterEmotion: getOppositeEmotion(beforeEmotion),
    afterSupport: "Expert-guided support system tailored to their needs",
    afterOutcome: `Successfully overcoming ${beforeProblem} with clarity`,
    afterText: "Now confident, empowered and achieving success"
  };
}


app.post("/generate", async (req, res) => {
  console.log("GENERATE REQUEST RECEIVED:", req.body);

  const {
    name,
    category,
    subCategory,
    persona,
    imageType,
    imageStyle,

    // BEFORE only
    beforePersona,
    beforeProblem,
    beforeEmotion,
    beforeEnvironment,
    beforeText
  } = req.body;

  const after = generateAfter(beforePersona, beforeEmotion, beforeProblem);

  const finalPrompt = `
==== BUSINESS DETAILS ====
Business Name: ${name}
Category: ${category}
Sub-Category: ${subCategory}
Target Persona: ${persona}

==== BEFORE ====
Persona: ${beforePersona}
Problem: ${beforeProblem}
Emotion: ${beforeEmotion}
Environment: ${beforeEnvironment}
Text on Image (Before): "${beforeText}"

==== AFTER (Rule-Based) ====
Persona: ${after.afterPersona}
Support Used: ${after.afterSupport}
Emotion: ${after.afterEmotion}
Outcome: ${after.afterOutcome}
Text on Image (After): "${after.afterText}"

==== FINAL VISUAL INSTRUCTION ====
Create a transformation visual showing the BEFORE state struggling and the AFTER state confident and successful. Use the provided details to shape expressions, environment, colors, and storytelling.
`;

  res.json({
    success: true,
    output: finalPrompt
  });
});


// =============================
//  START SERVER
// =============================

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
