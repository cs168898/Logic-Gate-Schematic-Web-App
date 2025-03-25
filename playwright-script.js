import { chromium } from 'playwright';
import fs from 'fs/promises';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

function formatLogicGates(jsonArray) {
    try {
        // Ensure input is an array (handles single object case)
        if (!Array.isArray(jsonArray)) {
            jsonArray = [jsonArray];
        }

        // Convert each gate object to the desired string format
        return jsonArray.map(gate => 
            `name: ${gate.name};
            type: ${gate.type.toUpperCase()};
            input: ${Array.isArray(gate.input) ? gate.input.join(",") : gate.input || ""};
            ${gate.output ? `output: ${gate.output};`: ""}
            ${gate.level? `level:${gate.level};` : ""}`
            ).join("\n\n"); // Separate multiple gates with a blank line

    } catch (error) {
        return "Invalid input format!";
    }
}

(async () => {
    const args = process.argv.slice(2);
    const userInput = args[0];

    console.error("Received input:", userInput);

    if (!userInput) {
        console.error("Invalid arguments. Usage: node playwright-script.js <userInput>");
        process.exit(1);
    }

    let parsedInput;
    try {
        // Ensure the input is parsed correctly
        parsedInput = JSON.parse(userInput);
        console.error("Parsed JSON input:", parsedInput);
    } catch (error) {
        console.error("Error parsing JSON input:", error);
        console.error("Received raw input:", userInput);
        process.exit(1);
    }

    const cleanedText = formatLogicGates(parsedInput);
    console.error("Cleaned input for the app:", cleanedText);

    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        const frontendURL = process.env.VITE_FRONTEND_URL || 'http://localhost:3000';
        await page.goto(frontendURL);

        // await page.evaluate(() => {
        //     const canvas = document.querySelectorAll(".konvajs-content canvas");
            
        //     if (canvas[1]) {
        //         canvas[1].style.width = "800px"; // Increase canvas size
        //         canvas[1].style.height = "600px";
        //     }
        // });

        // Hide the textarea and tools window
        await page.locator('.user-input').evaluate(el => el.style.opacity = '0');
        await page.locator('.tools-window').evaluate(el => el.style.opacity = '0');

        await page.waitForTimeout(1000);

        await page.fill(".user-input2", cleanedText);
        await page.click(".create-button");
        

        await page.locator(".konvajs-container");
        await page.waitForTimeout(1000); // Wait to stabilize rendering
          

          
        // Take a screenshot and output binary data to stdout
        const screenshotBuffer = await page.locator(".content-overlay").screenshot();

        await browser.close();

        process.stdout.write(screenshotBuffer);

        
    } catch (error) {
        console.error("Error in Playwright script:", error);
        process.exit(1);
    }
})();