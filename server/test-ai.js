const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Note: The SDK doesn't have a direct listModels method in the client, 
    // it usually happens via the API. But we can test 1.5-flash explicitly.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-1.5-flash-8b:", result.response.text());
    } catch (e2) {
        console.error("Failed with gemini-1.5-flash-8b:", e2.message);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            const result = await model.generateContent("Hi");
            console.log("Success with gemini-2.0-flash-exp:", result.response.text());
        } catch (e3) {
            console.error("Failed with gemini-2.0-flash-exp:", e3.message);
        }
    }
  }
}

listModels();
