require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================================
//  RULE SYSTEM FOR AFTER SECTION
// ================================

// Opposite emotions map
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

// Function to get opposite emotion
function getOppositeEmotion(before) {
    const key = before.toLowerCase().trim();
    return emotionMapping[key] || "positive and confident";
}

// Generate AFTER transformation
function generateAfter(beforePersona, beforeEmotion, beforeProblem) {
    return {
        afterPersona: `${beforePersona} transformed`,
        afterEmotion: getOppositeEmotion(beforeEmotion),
        afterSupport: `Guided support and structured solution tailored to their needs`,
        afterOutcome: `Successfully overcoming ${beforeProblem} with confidence`,
        afterText: `Now confident, empowered and achieving results`
    };
}

// ======================================
//      GENERATE ROUTE (RULE-BASED)
// ======================================
app.post("/generate", async (req, res) => {
  const {
    name,
    category,
    subCategory,
    persona,
    imageType,
    imageStyle,

    // BEFORE inputs
    beforePersona,
    beforeProblem,
    beforeEmotion,
    beforeEnvironment,
    beforeText
  } = req.body;

  // Step 1 — Apply rules
  const after = generateAfter(beforePersona, beforeEmotion, beforeProblem);

  // Step 2 — Rule-based prompt creation
  const prompt = `
==== BUSINESS DETAILS ====
Business Name: ${name}
Category: ${category}
Sub-Category: ${subCategory}
Target Persona: ${persona}

==== BEFORE ====
Persona (Before): ${beforePersona}
Main Problem: ${beforeProblem}
Emotion (Before): ${beforeEmotion}
Environment: ${beforeEnvironment}
Text on Image (Before): "${beforeText}"

==== AFTER (Rule-Based Transformation) ====
Persona (After): ${after.afterPersona}
Support Used: ${after.afterSupport}
Emotion (After): ${after.afterEmotion}
Outcome: ${after.afterOutcome}
Text on Image (After): "${after.afterText}"

==== IMAGE STYLE ====
Type: ${imageType}
Style: ${imageStyle}

==== FINAL PROMPT ====
Create a marketing-focused transformation visual showing the BEFORE state clearly transitioning into the AFTER state. The BEFORE state should emphasize struggle, negativity, or confusion. The AFTER should show confidence, empowerment, and success.
  `;

  // Step 3 — Return rule-based prompt
  res.json({
    success: true,
    output: prompt
  });
});

// ======================================
// START SERVER
// ======================================
app.listen(5000, () => {
  console.log("Backend server running on port 5000");
});
