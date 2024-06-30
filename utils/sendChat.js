const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
async function sendChat(prompt) {
  const {count, statement} = prompt
  const messages = [{ role: "user", parts: [{text:"List 10 single word product names as list that could be relevant for:"}]}]
  const chat = model.startChat({
    history: messages,
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.5
    },
  });
  const result = await chat.sendMessage(statement);
  console.log(typeof(result.response.text()));
  return extractProductNames(result.response.text())
}

function extractProductNames(text) {
  // Split the text into lines
  const lines = text.split(/\n/);
  // Filter lines to include only those that start with a number and a period
  const productLines = lines.filter(line => /^\d+\./.test(line));
  // Remove asterisks, numbers, periods, and trim each product line
  const cleanedProductNames = productLines.map(line => line.replace(/^\d+\.\s*\**|\**\s*$/g, '').trim());
  return cleanedProductNames;
}

module.exports = {sendChat}