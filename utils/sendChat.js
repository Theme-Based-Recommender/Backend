const OpenAI = require("openai")

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sendChat(prompt) {
  const {count, statement} = prompt
  const messages = [{ role: "user", content: `Give me only list of ${count} number of products to buy from amazon for the theme given in the next statement` }]
  messages.push({role: "user", content:statement})
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });
  return replaceNumbersAndNewlines(completion.choices[0].message.content)
}


function replaceNumbersAndNewlines(inputString) {
  // Replace numbers followed by a dot and space with an empty string
  const withoutNumbers = inputString.replace(/\d+\.\s/g, "");

  // Replace newline characters with a space
  const withoutNewlines = withoutNumbers.replace(/\n/g, ",");

  return withoutNewlines;
}


module.exports = {sendChat}