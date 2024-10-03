const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/config");

const genAI = new GoogleGenerativeAI(config.googleAIStudioApiKey);

class GoogleGeminiService {
  static async prompt(content) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(content);
    return result;
  }
}

module.exports = GoogleGeminiService;
