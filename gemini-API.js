import { GoogleGenAI } from "@google/genai";
import fs from 'fs'

const envAPIKey = process.env.GEMINI_API_KEY || "AIzaSyD8OX2JSD78BgiOtuRWSNYpoyzaS6edFxw"
const ai = new GoogleGenAI({ apiKey:  envAPIKey});

const typesOfGates = "AND, OR, NOT"

async function callGemini() {
    const inputPath = process.argv[2];
    const existingGatesPath = process.argv[3];
    const input = fs.readFileSync(inputPath, 'utf-8');
    const existingGates = JSON.parse(fs.readFileSync(existingGatesPath, 'utf-8'));
    const prompt = `
      Read the user input to design a circuit and then only output the logic gate's name, type, input, output and level.
      Here are some rules you must follow:
      1. ONLY RETURN the key value pairs with a semi colon at the end of every key value pair without comments and explanations or apologies
      2. DO NOT use code blocks, markdown syntax, or triple backticks in your response. Just return the key-value pairs as raw plain text.
      3. Use unique output values if it is not specified.
      4. Only use these gate types: ${typesOfGates}
      5. Integrate it into the existing gates structure:
        ${JSON.stringify(existingGates, null, 2)}
      6. Strictly follow the format of the example below.
      
      Here is the user input ${input}, here is an example of the output:  
      name: Gate1;
      type: AND;
      input: A, B;
      output: D;
      level: 1;
      `
      
    console.error('gemini API model called')
    console.error('existing gates structure = ', existingGates)
    console.error('the prompt is = ', prompt)
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-thinking-exp-01-21",
    contents: prompt,
  });


  console.error('The response is: ',response.text);
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log(text); // ✅ Output so Java can read it from stdout

  return text;
}

callGemini();