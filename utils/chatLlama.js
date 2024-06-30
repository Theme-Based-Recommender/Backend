async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Qwen/Qwen2-1.5B",
        {
            headers: { Authorization: "Bearer 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", "Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    // Check if the response is ok (status in the range 200-299)


    try {
        const result = await response.json();
        return extractProductNames(result[0]["generated_text"]);
    } catch (error) {
        // Handle JSON parsing error
        console.error("Error parsing JSON:", error);
        throw new Error("Failed to parse JSON response.");
    }
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

module.exports = { query };