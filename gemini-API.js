import { GoogleGenAI } from "@google/genai";
import fs from 'fs'

const envAPIKey = process.env.GEMINI_API_KEY || "AIzaSyD8OX2JSD78BgiOtuRWSNYpoyzaS6edFxw"
const ai = new GoogleGenAI({ apiKey:  envAPIKey});

const typesOfGates = "AND, OR, NOT, NAND"

async function callGemini() {
    const inputPath = process.argv[2];
    const existingGatesPath = process.argv[3];
    const input = fs.readFileSync(inputPath, 'utf-8');
    const existingGates = JSON.parse(fs.readFileSync(existingGatesPath, 'utf-8'));
    const prompt = `
      Read the user input to design a circuit and then output the logic gate's name, type, input, output and level.
      Here are some rules you must strictly follow:
      1. return the key value pairs with a semi colon at the end of every key value pair
      2. Your message at the top and Wrap the gates in triple backticks and add it at the end of your message
      3. Use unique output values if it is not specified.
      4. Only use these gate types: ${typesOfGates}
      5. Integrate it into the existing gates structure if its not empty:
        ${JSON.stringify(existingGates, null, 2)}
      6. Follow the format of the example below.
      7. Everything in the triple backticks MUST be in text only.
      
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